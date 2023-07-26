import { Button, Group, MultiSelect, Select, Stack } from '@mantine/core'
import { useEffect, useState } from 'react'
import { type JiraGroup, fetchJiraGroups } from '../../../../service/jiraService'
import { assignConfluenceSpaceAdminPermissionToUserGroups } from '../../../../service/confluenceService'

interface ConfluenceSpacePermissionAssignmentFormProps {
  iosTag: string
  spaceKey: string
  groupNameSuggestions: string[]
}

export const ConfluenceSpacePermissionAssignmentForm = ({
  iosTag,
  spaceKey,
  groupNameSuggestions,
}: ConfluenceSpacePermissionAssignmentFormProps): JSX.Element => {
  const [fetchedJiraGroups, setFetchedJiraGroups] = useState<JiraGroup[]>([])
  const [userGroups, setUserGroups] = useState<string[]>(groupNameSuggestions)

  useEffect(() => {
    const loadJiraGroups = async (): Promise<void> => {
      const response = await fetchJiraGroups(iosTag.toLowerCase())
      if (response) {
        setFetchedJiraGroups(response)
        setUserGroups(
          groupNameSuggestions.filter((groupName) =>
            response.map((fetchedJiraGroup) => fetchedJiraGroup.name).includes(groupName),
          ),
        )
      }
    }

    void loadJiraGroups()
  }, [iosTag])

  return (
    <Stack>
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
          value={userGroups}
          onChange={setUserGroups}
        />
      </Group>
      <Button
        onClick={() => {
          void assignConfluenceSpaceAdminPermissionToUserGroups({ spaceKey, userGroups })
        }}
      >
        Assign Permission
      </Button>
    </Stack>
  )
}
