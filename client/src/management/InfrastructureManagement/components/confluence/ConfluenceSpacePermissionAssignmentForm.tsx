import { Button, Group, MultiSelect, Select, Stack, Title } from '@mantine/core'
import { useEffect, useState } from 'react'
import { type JiraGroup, fetchJiraGroups } from '../../../../service/jiraService'
import {
  type ConfluenceSpace,
  assignConfluenceSpaceAdminPermissionToUserGroups,
  fetchConfluenceSpacesByKeys,
} from '../../../../service/confluenceService'

interface ConfluenceSpacePermissionAssignmentFormProps {
  iosTag: string
  spaceKeys: string[]
  groupNameSuggestions: string[]
}

export const ConfluenceSpacePermissionAssignmentForm = ({
  iosTag,
  spaceKeys,
  groupNameSuggestions,
}: ConfluenceSpacePermissionAssignmentFormProps): JSX.Element => {
  const [fetchedJiraGroups, setFetchedJiraGroups] = useState<JiraGroup[]>([])
  const [fetchedConfluenceSpaces, setFetchedConfluenceSpaces] = useState<ConfluenceSpace[]>([])
  const [userGroups, setUserGroups] = useState<Map<string, string[]>>()

  useEffect(() => {
    const suggestions = new Map<string, string[]>()
    spaceKeys.forEach((spaceKey) => {
      suggestions.set(spaceKey, groupNameSuggestions)
    })
    setUserGroups(suggestions)
  }, [groupNameSuggestions, spaceKeys])

  useEffect(() => {
    const newUserGroups = new Map<string, string[]>()
    fetchedConfluenceSpaces?.forEach((confluenceSpace) => {
      newUserGroups.set(
        confluenceSpace.key,
        groupNameSuggestions.filter((groupName) =>
          fetchedJiraGroups.map((fetchedJiraGroup) => fetchedJiraGroup.name).includes(groupName),
        ) ?? [],
      )
    })
    setUserGroups(newUserGroups)
  }, [groupNameSuggestions, fetchedJiraGroups, fetchedConfluenceSpaces])

  useEffect(() => {
    const loadJiraGroups = async (): Promise<void> => {
      const response = await fetchJiraGroups(iosTag.toLowerCase())
      if (response) {
        setFetchedJiraGroups(response)
      }
    }

    const loadConfluenceSpaces = async (): Promise<void> => {
      const response = await fetchConfluenceSpacesByKeys(spaceKeys)
      if (response) {
        setFetchedConfluenceSpaces(response)
      }
    }

    void loadJiraGroups()
    void loadConfluenceSpaces()
  }, [iosTag, spaceKeys])

  return (
    <Stack>
      {spaceKeys.map((spaceKey) => (
        <Stack key={spaceKey}>
          <Title order={5}>{spaceKey}</Title>
          <Group>
            <Select
              label='Permission'
              data={['administer', 'read', 'copy', 'create', 'delete', 'move']}
              value={'administer'}
              disabled
            />
            <MultiSelect
              label='User Groups'
              data={fetchedJiraGroups.map((fetchedJiraGroup) => fetchedJiraGroup.name)}
              placeholder='Select group names'
              searchable
              value={userGroups?.get(spaceKey) ?? []}
              onChange={(value) => {
                userGroups?.set(spaceKey, value)
              }}
            />
          </Group>
          <Button
            onClick={() => {
              if (userGroups?.get(spaceKey)) {
                void assignConfluenceSpaceAdminPermissionToUserGroups({
                  spaceKey,
                  userGroups: userGroups.get(spaceKey) ?? [],
                })
              }
            }}
          >
            Assign Permission
          </Button>
        </Stack>
      ))}
    </Stack>
  )
}
