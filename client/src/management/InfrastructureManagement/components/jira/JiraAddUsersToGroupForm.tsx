import { Button, Stack } from '@mantine/core'
import { useEffect, useState } from 'react'
import {
  addUsersToJiraGroup,
  createJiraGroups,
  fetchJiraGroups,
} from '../../../../service/jiraService'
import { MultiSelectCreatable } from '../../../../utilities/CustomMultiSelect/MultiSelectCreatable'
import { MultiSelectItem } from '../../../../utilities/CustomMultiSelect'

interface JiraAddUsersToGroupFormProps {
  iosTag: string
  students: string[]
}

export const JiraAddUsersToGroupForm = ({
  iosTag,
  students,
}: JiraAddUsersToGroupFormProps): JSX.Element => {
  const [studentUsernames, setStudentUsernames] = useState<MultiSelectItem[]>(
    students.map((s) => {
      return { label: s, value: s }
    }),
  )
  const [groupNameSuggestions, setGroupNameSuggestions] = useState<MultiSelectItem[]>([])
  const [groupNamesToCreate, setGroupNamesToCreate] = useState<MultiSelectItem[]>([])
  const [selectedGroups, setSelectedGroups] = useState<MultiSelectItem[]>([])

  useEffect(() => {
    const loadJiraGroups = async (): Promise<void> => {
      const response = await fetchJiraGroups(iosTag.toLowerCase())
      if (response) {
        setGroupNameSuggestions(
          response.map((jiraGroup) => {
            return { label: jiraGroup.name, value: jiraGroup.name }
          }),
        )

        const iosTagGroup = response
          .filter((g) => g.name.toLowerCase() === iosTag.toLowerCase())
          .at(0)
        if (iosTagGroup) {
          setSelectedGroups([
            ...selectedGroups,
            { label: iosTagGroup.name, value: iosTagGroup.name },
          ])
        }
      }
    }
    void loadJiraGroups()
  }, [iosTag, selectedGroups])

  useEffect(() => {
    setStudentUsernames(students.map((s) => ({ label: s, value: s })))
  }, [students])

  return (
    <Stack>
      <MultiSelectCreatable
        label='Student Usernames'
        data={studentUsernames}
        onCreate={(query) => {
          setStudentUsernames((current) => [...current, { label: query, value: query }])
          return query
        }}
        value={studentUsernames}
        onChange={setStudentUsernames}
      />
      <MultiSelectCreatable
        label='Group Names'
        data={groupNameSuggestions}
        onCreate={(query) => {
          setGroupNameSuggestions(() => [...groupNameSuggestions, { label: query, value: query }])
          setGroupNamesToCreate([...groupNamesToCreate, { label: query, value: query }])
          setSelectedGroups([...selectedGroups, { label: query, value: query }])
          return query
        }}
        value={selectedGroups}
        onChange={setSelectedGroups}
      />
      <Button
        variant='filled'
        onClick={() => {
          if (groupNamesToCreate.length > 0) {
            const createNewJiraGroups = async (): Promise<void> => {
              await createJiraGroups(
                groupNamesToCreate
                  .filter((gtc) => selectedGroups.includes(gtc))
                  .map((gtc) => gtc.value),
              )
              selectedGroups.forEach((selectedGroup) => {
                void addUsersToJiraGroup(
                  selectedGroup.value,
                  studentUsernames.map((s) => s.value),
                )
              })
            }
            void createNewJiraGroups()
          } else {
            selectedGroups.forEach((selectedGroup) => {
              void addUsersToJiraGroup(
                selectedGroup.value,
                studentUsernames.map((s) => s.value),
              )
            })
          }
        }}
        disabled={selectedGroups.length === 0 || studentUsernames.length === 0}
      >
        Submit
      </Button>
    </Stack>
  )
}
