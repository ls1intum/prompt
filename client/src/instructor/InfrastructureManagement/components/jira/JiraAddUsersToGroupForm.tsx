import { Button, FileInput, MultiSelect, Stack } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUpload } from '@tabler/icons-react'
import Papa from 'papaparse'
import { useEffect, useState } from 'react'
import {
  addUsersToJiraGroup,
  createJiraGroups,
  fetchJiraGroups,
} from '../../../../service/jiraService'

interface JiraAddUsersToGroupFormProps {
  iosTag: string
}

export const JiraAddUsersToGroupForm = ({ iosTag }: JiraAddUsersToGroupFormProps): JSX.Element => {
  const [studentUsernames, setStudentUsernames] = useState<string[]>([])
  const [groupNameSuggestions, setGroupNameSuggestions] = useState<string[]>([])
  const [groupNamesToCreate, setGroupNamesToCreate] = useState<string[]>([])
  const [selectedGroups, setSelectedGroups] = useState<string[]>([])

  useEffect(() => {
    const loadJiraGroups = async (): Promise<void> => {
      const response = await fetchJiraGroups(iosTag.toLowerCase())
      if (response) {
        setGroupNameSuggestions(response.map((jiraGroup) => jiraGroup.name))
      }
    }
    void loadJiraGroups()
  }, [])

  return (
    <Stack>
      <FileInput
        label='Student usernames'
        placeholder='Upload .csv file with student usernames'
        accept='.csv'
        icon={<IconUpload />}
        onChange={(file) => {
          if (file) {
            Papa.parse(file, {
              header: true,
              skipEmptyLines: true,
              delimiter: ',',
              complete: function (results: {
                data: Array<{ Username: string }>
                errors: Array<{ message: string; row: number }>
              }) {
                if (results.errors?.length > 0) {
                  notifications.show({
                    color: 'red',
                    autoClose: 5000,
                    title: 'Error',
                    message: `Failed to parse .csv due to error: ${results.errors[0].message}`,
                  })
                }
                const usernamesFromCsv: string[] = []

                results.data.forEach((data) => {
                  usernamesFromCsv.push(data.Username)
                })

                setStudentUsernames(usernamesFromCsv)
              },
            })
          }
        }}
      />
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
