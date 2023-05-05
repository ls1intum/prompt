import { Button, MultiSelect, Stack } from '@mantine/core'
import { useEffect, useState } from 'react'
import {
  addUsersToJiraGroup,
  createJiraGroups,
  fetchJiraGroups,
} from '../../../../service/jiraService'

interface JiraAddUsersToGroupFormProps {
  iosTag: string
  students: string[]
}

export const JiraAddUsersToGroupForm = ({
  iosTag,
  students,
}: JiraAddUsersToGroupFormProps): JSX.Element => {
  const [studentUsernames, setStudentUsernames] = useState<string[]>(students)
  const [groupNameSuggestions, setGroupNameSuggestions] = useState<string[]>([])
  const [groupNamesToCreate, setGroupNamesToCreate] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  useEffect(() => {
    const loadJiraGroups = async (): Promise<void> => {
      const response = await fetchJiraGroups(iosTag.toLowerCase())
      if (response) {
        setGroupNameSuggestions(response.map((jiraGroup) => jiraGroup.name))

        const iosTagGroup = response
          .filter((g) => g.name.toLowerCase() === iosTag.toLowerCase())
          .at(0)
        if (iosTagGroup) {
          setSelectedGroups([...selectedGroups, iosTagGroup.name])
        }
      }
    }
    void loadJiraGroups()
  }, [])

  useEffect(() => {
    setStudentUsernames(students)
  }, [students])

  return (
    <Stack>
      <MultiSelect
        label='Student Usernames'
        data={studentUsernames}
        placeholder='Select or type a username to create'
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          setStudentUsernames((current) => [...current, query])
          return query
        }}
        value={studentUsernames}
        onChange={setStudentUsernames}
      />
      <MultiSelect
        label='Group Names'
        data={groupNameSuggestions}
        placeholder='Select or type group names to create'
        searchable
        creatable
        getCreateLabel={(query) => `+ Create ${query}`}
        onCreate={(query) => {
          setGroupNameSuggestions(() => [...groupNameSuggestions, query])
          setGroupNamesToCreate([...groupNamesToCreate, query])
          setSelectedGroups([...selectedGroups, query])
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
                groupNamesToCreate.filter((gtc) => selectedGroups.includes(gtc)),
              )
              selectedGroups.forEach((selectedGroup) => {
                void addUsersToJiraGroup(selectedGroup, studentUsernames)
              })
            }
            void createNewJiraGroups()
          } else {
            selectedGroups.forEach((selectedGroup) => {
              void addUsersToJiraGroup(selectedGroup, studentUsernames)
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
