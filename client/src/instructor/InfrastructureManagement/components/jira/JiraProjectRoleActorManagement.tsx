import { ActionIcon, Button, Divider, Group, Stack, Table, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconX } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import {
  JIRA_PROJECTS_MGMT,
  type JiraGroup,
  type JiraProject,
  fetchJiraGroups,
  fetchJiraProjects,
  JIRA_USER_GROUPS_MGMT,
  addJiraProjectRoleActors,
  type JiraProjectRole,
  fetchJiraProjectRoles,
  type JiraProjectRoleActor,
  JIRA_PROJECT_ROLES,
} from '../../../../service/jiraService'

export interface ProjectRoleActorMapping {
  projectKey: string
  groupName?: string
  username?: string
}

interface JiraProjectRoleActorManagementProps {
  roleName: string
  initialProjectRoleActorMap: ProjectRoleActorMapping[]
}

interface JiraProjectRoleActorManagerProps {
  iosTag: string
}

export const JiraProjectRoleActorManager = ({
  iosTag,
}: JiraProjectRoleActorManagerProps): JSX.Element => {
  const [fetchedJiraProjectRoles, setFetchedJiraProjectRoles] = useState<JiraProjectRole[]>([])
  const [fetchedJiraGroups, setFetchedJiraGroups] = useState<JiraGroup[]>([])
  const [fetchedJiraProjects, setFetchedJiraProjects] = useState<JiraProject[]>([])
  const [usersRoleActorsToAdd, setUsersRoleActorsToAdd] = useState<ProjectRoleActorMapping[]>([])
  const [developersRoleActorsToAdd, setDevelopersRoleActorsToAdd] = useState<
    ProjectRoleActorMapping[]
  >([])
  const [administratorsRoleActorsToAdd, setAdministratorsRoleActorsToAdd] = useState<
    ProjectRoleActorMapping[]
  >([])

  useEffect(() => {
    const loadJiraProjectRoles = async (): Promise<void> => {
      const response = await fetchJiraProjectRoles()
      if (response) {
        setFetchedJiraProjectRoles(response)
      }
    }
    const loadJiraGroups = async (): Promise<void> => {
      const response = await fetchJiraGroups(iosTag.toLowerCase())
      if (response) {
        setFetchedJiraGroups(response)
      }
    }
    const loadJiraProjects = async (): Promise<void> => {
      const response = await fetchJiraProjects(iosTag)
      if (response) {
        setFetchedJiraProjects(response)
      }
    }
    void loadJiraProjectRoles()
    void loadJiraGroups()
    void loadJiraProjects()
  }, [iosTag])

  useEffect(() => {
    const newRoleActors: ProjectRoleActorMapping[] = []
    fetchedJiraGroups
      .filter((gtc) => JIRA_USER_GROUPS_MGMT.includes(gtc.name.substring(iosTag.length)))
      .forEach((gtc) => {
        fetchedJiraProjects
          .filter(
            (ptc) =>
              JIRA_PROJECTS_MGMT.filter((p) => p === ptc.name.substring(iosTag.length)).length > 0,
          )
          .forEach((ptc) => {
            newRoleActors.push({
              projectKey: ptc.name,
              groupName: gtc.name,
            })
          })
      })
    setUsersRoleActorsToAdd([...newRoleActors])
    setDevelopersRoleActorsToAdd([...newRoleActors])
    setAdministratorsRoleActorsToAdd([...newRoleActors])
  }, [fetchedJiraGroups, fetchedJiraProjects])

  return (
    <Stack>
      <JiraProjectRoleActorManagement
        roleName='users'
        initialProjectRoleActorMap={usersRoleActorsToAdd}
      />
      <Divider />
      <JiraProjectRoleActorManagement
        roleName='developers'
        initialProjectRoleActorMap={developersRoleActorsToAdd}
      />
      <Divider />
      <JiraProjectRoleActorManagement
        roleName='administrators'
        initialProjectRoleActorMap={administratorsRoleActorsToAdd}
      />
      <Divider />
      <Button
        onClick={() => {
          const payload: JiraProjectRoleActor[] = []
          JIRA_PROJECT_ROLES.forEach((role) => {
            const fetchedRole = fetchedJiraProjectRoles.find(
              (pr) => pr.name.toLowerCase() === role.toLowerCase(),
            )
            if (fetchedRole) {
              if (role === 'users') {
                const projectKeys = new Set(usersRoleActorsToAdd.map((u) => u.projectKey))
                projectKeys.forEach((projectKey) => {
                  const usersToAdd = usersRoleActorsToAdd.filter((u) => u.projectKey === projectKey)
                  payload.push({
                    projectKey,
                    roleId: fetchedRole.id,
                    groupNames: usersToAdd.map((u) => u.groupName ?? ''),
                  })
                })
              } else if (role === 'developers') {
                const projectKeys = new Set(developersRoleActorsToAdd.map((u) => u.projectKey))
                projectKeys.forEach((projectKey) => {
                  const developersToAdd = developersRoleActorsToAdd.filter(
                    (u) => u.projectKey === projectKey,
                  )
                  payload.push({
                    projectKey,
                    roleId: fetchedRole.id,
                    groupNames: developersToAdd.map((u) => u.groupName ?? ''),
                  })
                })
              } else if (role === 'administrators') {
                const projectKeys = new Set(administratorsRoleActorsToAdd.map((u) => u.projectKey))
                projectKeys.forEach((projectKey) => {
                  const administratorsToAdd = administratorsRoleActorsToAdd.filter(
                    (u) => u.projectKey === projectKey,
                  )
                  payload.push({
                    projectKey,
                    roleId: fetchedRole.id,
                    groupNames: administratorsToAdd.map((u) => u.groupName ?? ''),
                  })
                })
              }
            }
          })
          void addJiraProjectRoleActors(payload)
        }}
      >
        Save
      </Button>
    </Stack>
  )
}

export const JiraProjectRoleActorManagement = ({
  roleName,
  initialProjectRoleActorMap,
}: JiraProjectRoleActorManagementProps): JSX.Element => {
  const [projectRoleActorMap, setProjectRoleActorMap] = useState<ProjectRoleActorMapping[]>(
    initialProjectRoleActorMap,
  )
  const newProjectRoleActorMapping = useForm<ProjectRoleActorMapping>({
    initialValues: {
      projectKey: '',
      groupName: '',
      username: '',
    },
  })

  useEffect(() => {
    setProjectRoleActorMap(initialProjectRoleActorMap)
  }, [initialProjectRoleActorMap])

  return (
    <Stack>
      <Title order={4}>Role Name: {roleName}</Title>
      <Table striped highlightOnHover>
        <thead>
          <tr>
            <th>Project Key</th>
            <th>Group</th>
            <th>Username</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {projectRoleActorMap.map((projectRoleActorMapping) => (
            <tr
              key={`${projectRoleActorMapping.projectKey}-${
                projectRoleActorMapping.groupName ?? projectRoleActorMapping.username ?? ''
              }`}
            >
              <td>{projectRoleActorMapping.projectKey}</td>
              <td>{projectRoleActorMapping.groupName ?? '-'}</td>
              <td>{projectRoleActorMapping.username ?? '-'}</td>
              <td>
                <ActionIcon
                  onClick={() => {
                    setProjectRoleActorMap(
                      projectRoleActorMap.filter(
                        (prcm) =>
                          prcm.groupName !== projectRoleActorMapping.groupName ||
                          prcm.username !== projectRoleActorMapping.username ||
                          prcm.projectKey !== projectRoleActorMapping.projectKey,
                      ),
                    )
                  }}
                >
                  <IconX />
                </ActionIcon>
              </td>
            </tr>
          ))}
        </tbody>
      </Table>
      <Group position='center' grow style={{ display: 'flex', alignItems: 'flex-end' }}>
        <TextInput
          placeholder='Project key'
          label='Project Key'
          {...newProjectRoleActorMapping.getInputProps('projectKey')}
        />
        <TextInput
          placeholder='Group name'
          label='Group Name'
          {...newProjectRoleActorMapping.getInputProps('groupName')}
        />
        <TextInput
          placeholder='Username'
          label='Username'
          {...newProjectRoleActorMapping.getInputProps('username')}
        />
        <Button
          variant='filled'
          onClick={() => {
            setProjectRoleActorMap([...projectRoleActorMap, newProjectRoleActorMapping.values])
            newProjectRoleActorMapping.reset()
          }}
        >
          Add
        </Button>
      </Group>
    </Stack>
  )
}
