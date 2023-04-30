import { FileInput, Modal, Stack, Table } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUpload } from '@tabler/icons-react'
import Papa from 'papaparse'
import { useState } from 'react'

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
        <FileInput
          label='Team assignments'
          placeholder='Upload .csv file with team assignments'
          accept='.csv'
          icon={<IconUpload />}
          onChange={(file) => {
            if (file) {
              Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                delimiter: ',',
                complete: function (results: {
                  data: Array<{ attribute_2: string; teamName: string }>
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
                      tumId: data.attribute_2,
                      team: data.teamName,
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
      </Stack>
    </Modal>
  )
}
