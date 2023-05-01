import { useEffect, useState } from 'react'
import {
  JIRA_USER_GROUPS_MGMT,
  JIRA_USER_GROUPS_TEAMS,
  createJiraGroups,
} from '../../../../service/jiraService'
import { Button, MultiSelect, Stack, TextInput } from '@mantine/core'

interface JiraGroupsCreationFormProps {
  iosTag: string
  mode: 'mgmt' | 'teams'
  projectNames?: string[]
}

export const JiraGroupsCreationForm = ({
  iosTag,
  mode,
  projectNames,
}: JiraGroupsCreationFormProps): JSX.Element => {
  const [groupNameSuggestions, setGroupNameSuggestions] = useState(
    mode === 'mgmt'
      ? JIRA_USER_GROUPS_MGMT.map((groupName) => iosTag.toLowerCase() + groupName)
      : [],
  )
  const [groupNamesToCreate, setGroupNamesToCreate] = useState<string[]>(groupNameSuggestions)

  useEffect(() => {
    if (projectNames) {
      const generatedGroupNameSuggestions: string[] = []
      projectNames.forEach((pn) => {
        JIRA_USER_GROUPS_TEAMS.forEach((ug) => {
          generatedGroupNameSuggestions.push(pn.toLowerCase() + ug.toLowerCase())
        })
      })
      setGroupNameSuggestions(generatedGroupNameSuggestions)
      setGroupNamesToCreate(generatedGroupNameSuggestions)
    }
  }, [projectNames])

  return (
    <Stack>
      <TextInput required withAsterisk label='iOS Tag' value={iosTag} disabled />
      <MultiSelect
        label='Group Names'
        data={groupNameSuggestions}
        placeholder='Select or type group names to create'
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          setGroupNameSuggestions((current) => [...current, query])
          return query
        }}
        value={groupNamesToCreate}
        onChange={setGroupNamesToCreate}
      />
      <Button
        disabled={groupNamesToCreate.length === 0}
        onClick={() => {
          void createJiraGroups(groupNamesToCreate)
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
