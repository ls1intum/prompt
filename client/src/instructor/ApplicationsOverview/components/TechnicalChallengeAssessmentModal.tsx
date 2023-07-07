import { Button, FileInput, Modal, Stack, Table } from '@mantine/core'
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
      size='auto'
    >
      <Stack>
        <FileInput
          label='Technical Challenge Report'
          placeholder='Upload .csv file with projects'
          accept='.csv'
          icon={<IconUpload />}
          onChange={(file) => {
            if (file) {
              Papa.parse(file, {
                header: true,
                skipEmptyLines: true,
                delimiter: ';',
                complete: function (results: {
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
                <th>TUM ID</th>
                <th>Matriculation Number</th>
                <th>Programming Score</th>
              </tr>
            </thead>
            <tbody>
              {technicalChallengeReport.map((element) => (
                <tr key={element.tumId}>
                  <td>{element.tumId}</td>
                  <td>{element.matriculationNumber}</td>
                  <td>{element.score}</td>
                </tr>
              ))}
            </tbody>
          </Table>
        )}
      </Stack>
    </Modal>
  )
}
