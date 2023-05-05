import { Accordion, Button, Group, MultiSelect, Stack, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { type JiraGroup, fetchJiraGroups } from '../../../../service/jiraService'
import {
  BITBUCKET_PROJECT_PERMISSIONS,
  grantBitbucketProjectPermissions,
  type BitbucketProjectPermissionGrant,
} from '../../../../service/bitbucketService'

interface BitbucketPermissionsManagerProps {
  iosTag: string
  projectNames: string[]
}

export const BitbucketPermissionsManager = ({
  iosTag,
  projectNames,
}: BitbucketPermissionsManagerProps): JSX.Element => {
  const [fetchedJiraGroups, setFetchedJiraGroups] = useState<JiraGroup[]>([])
  const [bitbucketProjectPermissionGrants, setBitbucketProjectPermissionGrants] = useState<
    BitbucketProjectPermissionGrant[]
  >([])

  useEffect(() => {
    const loadJiraGroups = async (): Promise<void> => {
      const response = await fetchJiraGroups(iosTag.toLowerCase())
      if (response) {
        setFetchedJiraGroups(response)
      }
    }
    void loadJiraGroups()
  }, [])

  useEffect(() => {
    const generatedBitbucketProjectPermissionGrants: BitbucketProjectPermissionGrant[] = []
    projectNames.forEach((pn) => {
      BITBUCKET_PROJECT_PERMISSIONS.forEach((pp) => {
        generatedBitbucketProjectPermissionGrants.push({
          projectKey: pn,
          permission: pp,
          groupNames: fetchedJiraGroups
            .filter((g) => {
              if (pp === 'PROJECT_ADMIN') {
                return (
                  (g.name.toLowerCase().includes(iosTag.toLowerCase()) &&
                    g.name.toLowerCase().includes('pm')) ||
                  (g.name.toLowerCase().includes(pn.toLowerCase()) &&
                    g.name.toLowerCase().includes('mgmt'))
                )
              }
              if (g.name.toLowerCase().includes(pn.toLowerCase())) {
                if (pp === 'PROJECT_READ') {
                  return g.name.toLowerCase().includes('customers')
                } else {
                  return g.name.toLowerCase() === pn.toLowerCase()
                }
              }
              return false
            })
            .map((g) => g.name),
        })
      })
    })
    setBitbucketProjectPermissionGrants(generatedBitbucketProjectPermissionGrants)
  }, [projectNames, fetchedJiraGroups])

  return (
    <Stack>
      <Accordion multiple>
        {projectNames.map((pn) => (
          <Accordion.Item value={pn} key={pn}>
            <Accordion.Control>
              <Title order={5}>{pn}</Title>
            </Accordion.Control>
            <Accordion.Panel>
              {BITBUCKET_PROJECT_PERMISSIONS.map((pp) => (
                <Group key={pp} grow>
                  <Title order={6}>{pp}</Title>
                  <MultiSelect
                    label='Groups'
                    data={fetchedJiraGroups.map((g) => g.name)}
                    placeholder='Select a group'
                    searchable
                    value={
                      bitbucketProjectPermissionGrants
                        .filter((pra) => pra.projectKey === pn && pra.permission === pp)
                        .at(0)?.groupNames
                    }
                    onChange={(value) => {
                      setBitbucketProjectPermissionGrants(
                        bitbucketProjectPermissionGrants.map((pra) => {
                          if (pra.projectKey === pn && pra.permission === pp) {
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
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <Button
        variant='filled'
        onClick={() => {
          void grantBitbucketProjectPermissions(bitbucketProjectPermissionGrants)
        }}
      >
        Save
      </Button>
    </Stack>
  )
}
