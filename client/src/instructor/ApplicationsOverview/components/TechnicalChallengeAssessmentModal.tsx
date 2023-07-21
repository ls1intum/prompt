import { Button, FileInput, Modal, Select, Stack, Table } from '@mantine/core'
import { notifications } from '@mantine/notifications'
import { IconUpload } from '@tabler/icons-react'
import Papa from 'papaparse'
import { useState } from 'react'

export interface TechnicalChallengeResult {
  tumId: string
  matriculationNumber: string
  score: number
}

interface TechnicalChallengeReportRow {
  Username: string
  'Registration Number': string
  'Programming Score': string
}

interface TechnicalChallengeAssessmentModalProps {
  opened: boolean
  onClose: (technicalChallengeResults: TechnicalChallengeResult[]) => void
}

export const TechnicalChallengeAssessmentModal = ({
  opened,
  onClose,
}: TechnicalChallengeAssessmentModalProps): JSX.Element => {
  const [columnNames, setColumnNames] = useState<string[]>([])
  const [upload, setUpload] = useState<object[]>()
  const [technicalChallengeReport, setTechnicalChallengeReport] = useState<
    TechnicalChallengeResult[]
  >([])

  return (
    <Modal
      centered
      opened={opened}
      onClose={() => {
        onClose(technicalChallengeReport)
      }}
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
                  console.log(results)
                  console.log(results.data)
                  setColumnNames(results.meta.fields ?? [])
                  setUpload(results.data)
                  const scores: TechnicalChallengeResult[] = []

                  results.data.forEach((data) => {
                    scores.push({
                      tumId: data.Username ?? '',
                      matriculationNumber: data['Registration Number'] ?? '',
                      score: parseFloat(data['Programming Score'].replace('%', '')),
                    })
                  })

                  setTechnicalChallengeReport(scores)
                },
              })
            }
          }}
        />
        {upload && (
          <Select
            placeholder='Please select the column to read assessment scores from'
            data={columnNames}
          />
        )}
        {technicalChallengeReport && (
          <Button
            onClick={() => {
              onClose(technicalChallengeReport)
            }}
          >
            Assess
          </Button>
        )}
        {technicalChallengeReport.length !== 0 && (
          <Table striped withBorder withColumnBorders>
            <thead>
              <tr>
                {columnNames.map((columnName) => (
                  <th key={columnName}>{columnName}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {upload?.map((element, idx) => (
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
