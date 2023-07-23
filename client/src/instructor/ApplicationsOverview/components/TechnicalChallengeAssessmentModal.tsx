import { Button, FileInput, Group, Modal, Select, Stack, Table, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { IconUpload } from '@tabler/icons-react'
import Papa from 'papaparse'
import { useState } from 'react'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../redux/store'
import {
  assignTechnicalChallengeProgrammingScores,
  assignTechnicalChallengeQuizScores,
} from '../../../redux/applicationsSlice/thunks/assignTechnicalChallengeScores'

export interface TechnicalChallengeResult {
  programmingScoreThreshold: number
  quizScoreThreshold: number
  programmingScores: Map<string, number>
  quizScores: Map<string, number>
}

interface TechnicalChallengeReportRow {
  Username: string
  'Registration Number': string
  'Programming Score': string
}

interface TechnicalChallengeAssessmentModalProps {
  opened: boolean
  onClose: () => void
  tumIdToDeveloperApplicationMap: Map<string, string>
}

export const TechnicalChallengeAssessmentModal = ({
  opened,
  onClose,
  tumIdToDeveloperApplicationMap,
}: TechnicalChallengeAssessmentModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [columnNames, setColumnNames] = useState<string[]>([])
  const [upload, setUpload] = useState<object[]>()
  const technicalChallengeForm = useForm({
    initialValues: {
      tumIdColumnName: '',
      programmingScoreColumnName: '',
      quizScoreColumnName: '',
      programmingScoreThreshold: 0,
      quizScoreThreshold: 0,
    },
  })

  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      size='90%'
      title='Technical Challenge Assessment'
    >
      <Stack>
        <FileInput
          placeholder='Upload .csv technical challenge export file from Artemis'
          accept='.csv'
          icon={<IconUpload />}
          onChange={(file) => {
            if (file) {
              Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                delimiter: ';',
                complete: function (results: {
                  meta: {
                    fields: string[]
                  }
                  data: TechnicalChallengeReportRow[]
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
          <>
            <Select
              label='TUM ID Column Name'
              placeholder='Please select the column to read student TUM ID from'
              data={columnNames}
              {...technicalChallengeForm.getInputProps('tumIdColumnName')}
            />
            <Group grow>
              <Select
                label='Programming Score Column Name'
                placeholder='Please select the column to read programming scores from'
                data={columnNames}
                {...technicalChallengeForm.getInputProps('programmingScoreColumnName')}
              />
              <Select
                label='Quiz Score Column Name'
                placeholder='Please select the column to read quiz scores from'
                data={columnNames}
                {...technicalChallengeForm.getInputProps('quizScoreColumnName')}
              />
            </Group>
            <Group grow>
              <TextInput
                label='Programming Score Threshold'
                type='number'
                {...technicalChallengeForm.getInputProps('programmingScoreThreshold')}
              />
              <TextInput
                label='Quiz Score Threshold'
                type='number'
                {...technicalChallengeForm.getInputProps('quizScoreThreshold')}
              />
            </Group>
          </>
        )}
        {upload && (
          <Button
            onClick={() => {
              const programmingScores: Map<string, number> = new Map<string, number>()
              const quizScores: Map<string, number> = new Map<string, number>()
              upload.forEach((data) => {
                programmingScores.set(
                  tumIdToDeveloperApplicationMap.get(
                    (data as any)[technicalChallengeForm.values.tumIdColumnName] ?? '',
                  ) ?? '',
                  parseFloat(
                    (data as any)[technicalChallengeForm.values.programmingScoreColumnName].replace(
                      '%',
                      '',
                    ),
                  ),
                )

                quizScores.set(
                  tumIdToDeveloperApplicationMap.get(
                    (data as any)[technicalChallengeForm.values.tumIdColumnName] ?? '',
                  ) ?? '',
                  parseFloat(
                    (data as any)[technicalChallengeForm.values.quizScoreColumnName].replace(
                      '%',
                      '',
                    ),
                  ),
                )
              })

              void dispatch(
                assignTechnicalChallengeProgrammingScores({
                  programmingScoreThreshold:
                    technicalChallengeForm.values.programmingScoreThreshold,
                  programmingScores,
                }),
              )

              void dispatch(
                assignTechnicalChallengeQuizScores({
                  quizScoreThreshold: technicalChallengeForm.values.quizScoreThreshold,
                  quizScores,
                }),
              )
              onClose()
            }}
          >
            Assess
          </Button>
        )}
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
