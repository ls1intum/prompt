import { useEffect, useState } from 'react'
import {
  type JiraProjectRole,
  type JiraGroup,
  fetchJiraGroups,
  type JiraProjectRoleActor,
  addJiraProjectRoleActors,
  JIRA_PROJECT_ROLES,
} from '../../../../service/jiraService'
import { fetchJiraProjectRoles } from '../../../../service/jiraService'
import { Accordion, Button, Group, MultiSelect, Stack, Title } from '@mantine/core'

interface JiraPermissionManagerProps {
  iosTag: string
  projectNames: string[]
}

export const JiraPermissionManager = ({
  iosTag,
  projectNames,
}: JiraPermissionManagerProps): JSX.Element => {
  const [fetchedJiraGroups, setFetchedJiraGroups] = useState<JiraGroup[]>([])
  const [fetchedJiraProjectRoles, setFetchedJiraProjectRoles] = useState<JiraProjectRole[]>([])
  const [jiraProjectRoleActors, setJiraProjectRoleActors] = useState<JiraProjectRoleActor[]>([])

  useEffect(() => {
    const loadJiraGroups = async (): Promise<void> => {
      const response = await fetchJiraGroups(iosTag.toLowerCase())
      if (response) {
        setFetchedJiraGroups(response)
      }
    }
    const loadJiraProjectRoles = async (): Promise<void> => {
      const response = await fetchJiraProjectRoles()
      if (response) {
        setFetchedJiraProjectRoles(
          response.filter((pr) => JIRA_PROJECT_ROLES.includes(pr.name.toLowerCase())),
        )
      }
    }
    void loadJiraGroups()
    void loadJiraProjectRoles()
  }, [iosTag])

  useEffect(() => {
    const generatedJiraProjectRoleActors: JiraProjectRoleActor[] = []
    projectNames.forEach((pn) => {
      fetchedJiraProjectRoles.forEach((pr) => {
        generatedJiraProjectRoleActors.push({
          projectKey: pn,
          roleId: pr.id,
          groupNames: fetchedJiraGroups
            .filter(
              (g) =>
                g.name.toLowerCase().includes(pn.toLowerCase()) &&
                (pr.name.toLowerCase().includes('administrators')
                  ? g.name.toLowerCase().includes('-mgmt')
                  : true),
            )
            .map((g) => g.name),
        })
      })
    })
    setJiraProjectRoleActors(generatedJiraProjectRoleActors)
  }, [projectNames, fetchedJiraGroups, fetchedJiraProjectRoles])

  return (
    <Stack>
      <Accordion multiple>
        {projectNames.map((pn) => (
          <Accordion.Item value={pn} key={pn}>
            <Accordion.Control>
              <Title order={5}>{pn}</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack>
                {fetchedJiraProjectRoles.map((pr) => (
                  <Group key={pr.name} grow>
                    <Title order={6}>{pr.name}</Title>
                    <MultiSelect
                      label='Groups'
                      data={fetchedJiraGroups.map((g) => g.name)}
                      placeholder='Select a group'
                      searchable
                      value={
                        jiraProjectRoleActors
                          .filter((pra) => pra.projectKey === pn && pra.roleId === pr.id)
                          .at(0)?.groupNames
                      }
                      onChange={(value) => {
                        setJiraProjectRoleActors(
                          jiraProjectRoleActors.map((pra) => {
                            if (pra.projectKey === pn && pra.roleId === pr.id) {
                              return {
                                ...pra,
                                groupNames: value,
                              }
                            } else {
                              return pra
                            }
                          }),
                        )
                      }}
                    />
                  </Group>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <Button
        onClick={() => {
          void addJiraProjectRoleActors(jiraProjectRoleActors)
        }}
      >
        Save
      </Button>
    </Stack>
  )
}
