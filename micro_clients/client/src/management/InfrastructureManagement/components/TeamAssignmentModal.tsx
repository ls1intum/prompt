import { Button, Card, FileInput, Modal, Stack, Table, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUpload } from '@tabler/icons-react'
import Papa from 'papaparse'
import { useState } from 'react'
import { addUsersToJiraGroup } from '../../../network/jiraService'

interface TeamAssignmentModalProps {
  opened: boolean
  onClose: () => void
  iosTag: string
}

export const TeamAssignmentModal = ({ opened, onClose }: TeamAssignmentModalProps): JSX.Element => {
  const [studentTeamMappings, setStudentTeamMappings] = useState<
    Array<{
      tumId: string
      team: string
    }>
  >([])

  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      size='100%'
      title='Add Students to Jira Groups'
      padding='lg'
    >
      <Stack>
        <Text fz='sm' c='dimmed'>
          Upload a .csv file with mapping of student usernames to teams. An expected file structure
          is exemplified below.
        </Text>
        <Card>
          <Text fz='sm' ta='right' c='dimmed'>
            mappings.csv
          </Text>
          <Text fz='sm' c='bold'>
            Username,Team
          </Text>
          <Text fz='sm' c='dimmed'>
            username_1,team_1
          </Text>
          <Text fz='sm' c='dimmed'>
            username_2,team_2
          </Text>
        </Card>
        <FileInput
          label='Team assignments'
          placeholder='Upload .csv file with team assignments'
          accept='.csv'
          leftSection={<IconUpload />}
          onChange={(file) => {
            if (file) {
              Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                delimiter: ',',
                complete: function (results: {
                  data: Array<{ Username: string; Team: string }>
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
                  const mappingsFromCsv: Array<{
                    tumId: string
                    team: string
                  }> = []

                  results.data.forEach((data) => {
                    mappingsFromCsv.push({
                      tumId: data.Username,
                      team: data.Team,
                    })
                  })

                  setStudentTeamMappings(mappingsFromCsv)
                },
              })
            }
          }}
        />
        {studentTeamMappings.length > 0 && (
          <Table striped highlightOnHover>
            <thead>
              <tr>
                <th>TUM ID</th>
                <th>Team</th>
              </tr>
            </thead>
            <tbody>
              {studentTeamMappings.map((studentTeamMapping) => (
                <tr key={`${studentTeamMapping.tumId}`}>
                  <td>{studentTeamMapping.tumId}</td>
                  <td>{studentTeamMapping.team}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
        <Button
          variant='filled'
          disabled={studentTeamMappings.length === 0}
          onClick={() => {
            studentTeamMappings.forEach((stm) => {
              void addUsersToJiraGroup(stm.team, [stm.tumId])
            })
          }}
        >
          Save
        </Button>
      </Stack>
    </Modal>
  )
}
