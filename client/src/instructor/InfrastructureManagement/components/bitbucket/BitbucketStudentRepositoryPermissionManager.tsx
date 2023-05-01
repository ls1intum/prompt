import { useEffect, useState } from 'react'
import {
  BITBUCKET_PROJECT_REPOSITORY_PERMISSIONS,
  type BitbucketProject,
  type BitbucketRepository,
  fetchBitbucketProjectRepositories,
  fetchBitbucketProjects,
  type BitbucketRepositoryPermissionGrant,
  grantBitbucketProjectRepositoryPermissions,
} from '../../../../service/bitbucketService'
import { Accordion, Button, Group, MultiSelect, Select, Stack, Title } from '@mantine/core'
import { fetchJiraGroups } from '../../../../service/jiraService'

interface BitbucketStudentRepositoryPermissionManagerProps {
  iosTag: string
  students: string[]
}

export const BitbucketStudentRepositoryPermissionManager = ({
  iosTag,
  students,
}: BitbucketStudentRepositoryPermissionManagerProps): JSX.Element => {
  const [selectedBitbucketProject, setSelectedBitbucketProject] = useState<string | null>()
  const [fetchedBitbucketProjects, setFetchedBitbucketProjects] = useState<BitbucketProject[]>([])
  const [fetchedBitbucketProjectRepositories, setFetchedBitbucketProjectRepositories] = useState<
    BitbucketRepository[]
  >([])
  const [bitbucketRepositoryPermissionGrants, setBitbucketRepositoryPermissionGrants] = useState<
    BitbucketRepositoryPermissionGrant[]
  >([])
  const [userSuggestions, setUserSuggestions] = useState<string[]>([])
  const [groupSuggestions, setGroupSuggestions] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  useEffect(() => {
    const loadBitbucketProjects = async (): Promise<void> => {
      const response = await fetchBitbucketProjects(`${iosTag.toLowerCase()}-intro`)
      if (response) {
        setFetchedBitbucketProjects(response)

        const iosTagBitbucketProject = response
          .filter((p) => p.key.toLowerCase() === `${iosTag.toLowerCase()}-intro`)
          .at(0)
        if (iosTagBitbucketProject) {
          setSelectedBitbucketProject(iosTagBitbucketProject.key)
        }
      }
    }
    void loadBitbucketProjects()

    const loadJiraGroups = async (): Promise<void> => {
      const response = await fetchJiraGroups(iosTag.toLowerCase())
      if (response) {
        setGroupSuggestions(response.map((jiraGroup) => jiraGroup.name))

        const tutorsGroup = response
          .filter((g) => g.name.toLowerCase() === `${iosTag.toLowerCase()}tutors`)
          .at(0)
        if (tutorsGroup) {
          setSelectedGroups([...selectedGroups, tutorsGroup.name])
        }
      }
    }
    void loadJiraGroups()
  }, [])

  useEffect(() => {
    const loadBitbucketProjectRepositories = async (): Promise<void> => {
      if (selectedBitbucketProject) {
        const response = await fetchBitbucketProjectRepositories(selectedBitbucketProject)
        if (response) {
          setFetchedBitbucketProjectRepositories(response)
        }
      }
    }
    void loadBitbucketProjectRepositories()
  }, [selectedBitbucketProject])

  useEffect(() => {
    const generatedBitbucketRepositoryPermissionGrants: BitbucketRepositoryPermissionGrant[] = []
    fetchedBitbucketProjectRepositories.forEach((r) => {
      if (students.includes(r.name.toLowerCase())) {
        BITBUCKET_PROJECT_REPOSITORY_PERMISSIONS.forEach((p) => {
          if (p === 'REPO_WRITE') {
            generatedBitbucketRepositoryPermissionGrants.push({
              projectKey: selectedBitbucketProject ?? '',
              repositorySlug: r.slug,
              permission: p,
              users: [r.name.toLowerCase()],
              groupNames: [],
            })
          } else if (p === 'REPO_ADMIN') {
            generatedBitbucketRepositoryPermissionGrants.push({
              projectKey: selectedBitbucketProject ?? '',
              repositorySlug: r.slug,
              permission: 'REPO_ADMIN',
              users: [],
              groupNames: selectedGroups,
            })
          }
        })
      }
    })
    setBitbucketRepositoryPermissionGrants(generatedBitbucketRepositoryPermissionGrants)
  }, [selectedBitbucketProject, fetchedBitbucketProjectRepositories])

  useEffect(() => {
    setUserSuggestions(students)
  }, [students])

  return (
    <Stack>
      <Select
        label='Project'
        data={fetchedBitbucketProjects.map((p) => p.key)}
        placeholder='Select Bitbucket project'
        searchable
        value={selectedBitbucketProject}
        onChange={setSelectedBitbucketProject}
      />
      <Accordion>
        {students.map((s) => (
          <Accordion.Item value={s} key={s}>
            <Accordion.Control>
              <Title order={5}>{s}</Title>
            </Accordion.Control>
            <Accordion.Panel>
              <Stack>
                {BITBUCKET_PROJECT_REPOSITORY_PERMISSIONS.map((p) => (
                  <Group key={p} grow>
                    <Title order={6}>{p}</Title>
                    {p === 'REPO_WRITE' ? (
                      <MultiSelect
                        label={'Users'}
                        data={userSuggestions}
                        placeholder={'Select users'}
                        searchable
                        value={
                          bitbucketRepositoryPermissionGrants
                            .filter((g) => g.permission === p && g.repositorySlug === s)
                            .at(0)?.users
                        }
                        creatable
                        getCreateLabel={(query) => `+ Create ${query}`}
                        onCreate={(query) => {
                          setUserSuggestions([...userSuggestions, query])
                          return query
                        }}
                        onChange={(value) => {
                          setBitbucketRepositoryPermissionGrants(
                            bitbucketRepositoryPermissionGrants.map((grant) => {
                              if (grant.repositorySlug === s && grant.permission === p) {
                                return {
                                  ...grant,
                                  users: value,
                                }
                              }
                              return grant
                            }),
                          )
                        }}
                      />
                    ) : (
                      <MultiSelect
                        label={'Groups'}
                        data={groupSuggestions}
                        placeholder={'Select groups'}
                        searchable
                        value={
                          bitbucketRepositoryPermissionGrants
                            .filter((g) => g.permission === p && g.repositorySlug === s)
                            .at(0)?.groupNames
                        }
                        onChange={(value) => {
                          console.log(value)
                          setBitbucketRepositoryPermissionGrants(
                            bitbucketRepositoryPermissionGrants.map((grant) => {
                              if (grant.repositorySlug === s && grant.permission === p) {
                                return {
                                  ...grant,
                                  groupNames: value,
                                }
                              }
                              return grant
                            }),
                          )
                        }}
                      />
                    )}
                  </Group>
                ))}
              </Stack>
            </Accordion.Panel>
          </Accordion.Item>
        ))}
      </Accordion>
      <Button
        variant='filled'
        onClick={() => {
          console.log(bitbucketRepositoryPermissionGrants)
          void grantBitbucketProjectRepositoryPermissions(bitbucketRepositoryPermissionGrants)
        }}
      >
        Save
      </Button>
    </Stack>
  )
}
