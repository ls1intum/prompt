import { useEffect, useState } from 'react'
import {
  JIRA_USER_GROUPS_MGMT,
  JIRA_USER_GROUPS_TEAMS,
  createJiraGroups,
} from '../../../../service/jiraService'
import { Button, Stack, TextInput } from '@mantine/core'
import { MultiSelectCreatable } from '../../../../utilities/CustomMultiSelect/MultiSelectCreatable'
import { MultiSelectItem } from '../../../../utilities/CustomMultiSelect'

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
  const [groupNameSuggestions, setGroupNameSuggestions] = useState<MultiSelectItem[]>(
    mode === 'mgmt'
      ? JIRA_USER_GROUPS_MGMT.map((groupName) => {
          return {
            label: iosTag.toLowerCase() + groupName,
            value: iosTag.toLowerCase() + groupName,
          }
        })
      : [],
  )
  const [groupNamesToCreate, setGroupNamesToCreate] =
    useState<MultiSelectItem[]>(groupNameSuggestions)

  useEffect(() => {
    if (projectNames) {
      const generatedGroupNameSuggestions: MultiSelectItem[] = []
      projectNames.forEach((pn) => {
        JIRA_USER_GROUPS_TEAMS.forEach((ug) => {
          generatedGroupNameSuggestions.push({
            label: pn.toLowerCase() + ug.toLowerCase(),
            value: pn.toLowerCase() + ug.toLowerCase(),
          })
        })
      })
      setGroupNameSuggestions(generatedGroupNameSuggestions)
      setGroupNamesToCreate(generatedGroupNameSuggestions)
    }
  }, [projectNames])

  return (
    <Stack>
      <TextInput required withAsterisk label='iOS Tag' value={iosTag} disabled />
      <MultiSelectCreatable
        label='Group Names'
        data={groupNameSuggestions}
        onCreate={(query) => {
          setGroupNameSuggestions((current) => [...current, { label: query, value: query }])
          return query
        }}
        value={groupNamesToCreate}
        onChange={setGroupNamesToCreate}
      />
      <Button
        disabled={groupNamesToCreate.length === 0}
        onClick={() => {
          void createJiraGroups(groupNamesToCreate.map((g) => g.value))
        }}
      >
        Create
      </Button>
    </Stack>
  )
}
