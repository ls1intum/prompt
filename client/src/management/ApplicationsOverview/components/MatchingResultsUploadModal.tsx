import { Button, FileInput, Group, Modal, Select, Stack, Table, Text } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUpload } from '@tabler/icons-react'
import Daddy from 'papaparse'
import { postApplicationEnrollment } from '../../../network/application'
import { ApplicationType } from '../../../interface/application'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Query } from '../../../state/query'
import { useState } from 'react'

interface MatchingResultsUploadModalProps {
  opened: boolean
  onClose: () => void
  tumIdToApplicationMap: Map<string, string>
  matriculationNumberToApplicationMap: Map<string, string>
  applicationType: ApplicationType
}

export const MatchingResultsUploadModal = ({
  opened,
  onClose,
  applicationType,
  tumIdToApplicationMap,
  matriculationNumberToApplicationMap,
}: MatchingResultsUploadModalProps): JSX.Element => {
  const queryClient = useQueryClient()
  const [columnNames, setColumnNames] = useState<string[]>([])
  const [upload, setUpload] = useState<object[]>()
  const [joinColumnName, setJoinColumnName] = useState<string | null>(null)
  const [joinColumnName2, setJoinColumnName2] = useState<string | null>(null)

  const enrollApplication = useMutation({
    mutationFn: (variables: { applicationType: ApplicationType; applicationIds: string[] }) =>
      postApplicationEnrollment(variables.applicationType, variables.applicationIds),
    onSuccess: (data, variables) => {
      if (variables.applicationType === ApplicationType.DEVELOPER) {
        queryClient.invalidateQueries({ queryKey: [Query.DEVELOPER_APPLICATION] })
      } else if (variables.applicationType === ApplicationType.COACH) {
        queryClient.invalidateQueries({ queryKey: [Query.COACH_APPLICATION] })
      } else if (variables.applicationType === ApplicationType.TUTOR) {
        queryClient.invalidateQueries({ queryKey: [Query.TUTOR_APPLICATION] })
      }
    },
  })

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
          leftSection={<IconUpload />}
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
              enrollApplication.mutate({
                applicationType: applicationType as ApplicationType,
                applicationIds: enrolledApplicationIds,
              })
              onClose()
            }
          }}
        >
          Update Applications
        </Button>
        {upload && (
          <Table striped withTableBorder withColumnBorders>
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
