import { Button, FileInput, Group, Modal, Select, Stack, Table, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUpload } from '@tabler/icons-react'
import Daddy from 'papaparse'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../redux/store'
import {
  enrollCoachApplicationsToCourse,
  enrollDeveloperApplicationsToCourse,
  enrollTutorApplicationsToCourse,
} from '../../../redux/applicationsSlice/thunks/enrollApplicationsToCourse'

interface MatchingResultsUploadModalProps {
  opened: boolean
  onClose: () => void
  tumIdToApplicationMap: Map<string, string>
  matriculationNumberToApplicationMap: Map<string, string>
  applicationType: string
}

export const MatchingResultsUploadModal = ({
  opened,
  onClose,
  applicationType,
  tumIdToApplicationMap,
  matriculationNumberToApplicationMap,
}: MatchingResultsUploadModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [columnNames, setColumnNames] = useState<string[]>([])
  const [upload, setUpload] = useState<object[]>()
  const [joinColumnName, setJoinColumnName] = useState<string | null>(null)
  const [joinColumnName2, setJoinColumnName2] = useState<string | null>(null)

  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      size='90%'
      title={
        <Text c='dimmed' fz='sm'>
          Upload Matching Results
        </Text>
      }
    >
      <Stack>
        <FileInput
          placeholder='Upload .csv export file from Matching Tool'
          accept='.csv'
          icon={<IconUpload />}
          onChange={(file) => {
            if (file) {
              Daddy.parse(file, {
                header: true,
                skipEmptyLines: true,
                complete: function (results: {
                  meta: {
                    fields: string[]
                  }
                  data: any[]
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

                  setColumnNames(results.meta.fields ?? [])
                  setUpload(results.data)
                },
              })
            }
          }}
        />
        {upload && (
          <Group grow>
            <Select
              withAsterisk
              required
              label='Join Column Name in Uploaded Data'
              placeholder='Please select the column to join'
              data={columnNames}
              value={joinColumnName}
              onChange={(value) => {
                setJoinColumnName(value)
              }}
            />
            <Select
              withAsterisk
              required
              label='Join Column Name in Applications Loaded from Server'
              placeholder='Please select the column to join'
              data={['tumId', 'matriculationNumber']}
              value={joinColumnName2}
              onChange={(value) => {
                setJoinColumnName2(value)
              }}
            />
          </Group>
        )}
        <Button
          disabled={!upload || !joinColumnName || !joinColumnName2}
          onClick={() => {
            if (upload && joinColumnName && joinColumnName2) {
              let enrolledApplicationIds: string[] = []
              if (joinColumnName2 === 'tumId') {
                enrolledApplicationIds = upload
                  .filter((value) => tumIdToApplicationMap.has((value as any)[joinColumnName]))
                  .map((value) => {
                    return tumIdToApplicationMap.get((value as any)[joinColumnName]) ?? ''
                  })
              } else if (joinColumnName2 === 'matriculationNumber') {
                enrolledApplicationIds = upload
                  .filter((value) =>
                    matriculationNumberToApplicationMap.has((value as any)[joinColumnName]),
                  )
                  .map((value) => {
                    return (
                      matriculationNumberToApplicationMap.get((value as any)[joinColumnName]) ?? ''
                    )
                  })
              }
              if (applicationType === 'DEVELOPER') {
                void dispatch(enrollDeveloperApplicationsToCourse(enrolledApplicationIds))
              } else if (applicationType === 'COACH') {
                void dispatch(enrollCoachApplicationsToCourse(enrolledApplicationIds))
              } else if (applicationType === 'TUTOR') {
                void dispatch(enrollTutorApplicationsToCourse(enrolledApplicationIds))
              }
              onClose()
            }
          }}
        >
          Update Applications
        </Button>
        {upload && (
          <Table striped withBorder withColumnBorders>
            <thead>
              <tr>
                {columnNames.map((columnName) => (
                  <th key={columnName}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upload.map((element, idx) => (
                <tr key={idx}>
                  {columnNames.map((columnName) => (
                    <td key={columnName}>{(element as any)[columnName]}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Stack>
    </Modal>
  )
}
