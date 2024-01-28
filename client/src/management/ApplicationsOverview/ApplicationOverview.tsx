import { Group, TextInput, Checkbox, Stack, Button, Menu, Tooltip } from '@mantine/core'
import { IconAdjustments, IconSearch } from '@tabler/icons-react'
import { useState, useMemo } from 'react'
import { TechnicalChallengeAssessmentModal } from './components/TechnicalChallengeAssessmentModal'
import { ApplicationDatatable } from './components/ApplicationDatatable'
import { MatchingResultsUploadModal } from './components/MatchingResultsUploadModal'
import { useApplicationStore } from '../../state/zustand/useApplicationStore'

export interface Filters {
  male: boolean
  female: boolean
  status: string[]
  applicationType: string[]
}

export const StudentApplicationOverview = (): JSX.Element => {
  const { developerApplications, coachApplications, tutorApplications } = useApplicationStore()
  const [technicalChallengeAssessmentModalOpened, setTechnicalChallengeAssessmentModalOpened] =
    useState(false)
  const [matchingResultsUploadModalOpened, setMatchingResultsUploadModalOpened] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({
    male: false,
    female: false,
    status: [],
    applicationType: ['developer'],
  })

  const tumIdToApplicationMap = useMemo(() => {
    const map = new Map<string, string>()
    if (filters.applicationType.includes('developer')) {
      developerApplications.forEach((application) => {
        if (application.student.tumId) {
          map.set(application.student.tumId, application.id)
        }
      })
    } else if (filters.applicationType.includes('coach')) {
      coachApplications.forEach((application) => {
        if (application.student.tumId) {
          map.set(application.student.tumId, application.id)
        }
      })
    } else if (filters.applicationType.includes('tutor')) {
      tutorApplications.forEach((application) => {
        if (application.student.tumId) {
          map.set(application.student.tumId, application.id)
        }
      })
    }
    return map
  }, [filters.applicationType, developerApplications, coachApplications, tutorApplications])

  const matriculationNumberToApplicationMap = useMemo(() => {
    const map = new Map<string, string>()
    if (filters.applicationType.includes('DEVELOPER')) {
      developerApplications.forEach((application) => {
        if (application.student.matriculationNumber) {
          map.set(application.student.matriculationNumber, application.id)
        }
      })
    } else if (filters.applicationType.includes('COACH')) {
      coachApplications.forEach((application) => {
        if (application.student.matriculationNumber) {
          map.set(application.student.matriculationNumber, application.id)
        }
      })
    } else if (filters.applicationType.includes('TUTOR')) {
      tutorApplications.forEach((application) => {
        if (application.student.matriculationNumber) {
          map.set(application.student.matriculationNumber, application.id)
        }
      })
    }
    return map
  }, [filters.applicationType, developerApplications, coachApplications, tutorApplications])

  return (
    <Stack>
      <Group align='apart'>
        <Group align='left' style={{ alignItems: 'center' }}>
          <TextInput
            style={{ margin: '1vh 0', width: '30vw' }}
            placeholder='Search applications...'
            leftSection={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.currentTarget.value)
            }}
          />
          <Menu withArrow closeOnItemClick={false}>
            <Menu.Target>
              <IconAdjustments />
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item>
                <Checkbox
                  label='Male'
                  checked={filters.male}
                  onChange={(e) => {
                    setFilters({ ...filters, male: e.currentTarget.checked })
                  }}
                />
              </Menu.Item>
              <Menu.Item>
                <Checkbox
                  label='Female'
                  checked={filters.female}
                  onChange={(e) => {
                    setFilters({ ...filters, female: e.currentTarget.checked })
                  }}
                />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Group>
          <Button
            variant='outline'
            disabled={filters.applicationType.length !== 1}
            onClick={() => {
              setMatchingResultsUploadModalOpened(true)
            }}
          >
            Upload Matching Results
          </Button>
          <Tooltip
            withArrow
            color='blue'
            label="To start automatic assessment of developer applications based on the 
            technical challenge score, please select solely 'Developer' sorting filter"
          >
            <div>
              <Button
                disabled={
                  filters.applicationType.length > 1 ||
                  !filters.applicationType.includes('DEVELOPER')
                }
                onClick={() => {
                  setTechnicalChallengeAssessmentModalOpened(true)
                }}
              >
                Technical Challenge Assessment
              </Button>
            </div>
          </Tooltip>
        </Group>
        <TechnicalChallengeAssessmentModal
          opened={technicalChallengeAssessmentModalOpened}
          onClose={() => {
            setTechnicalChallengeAssessmentModalOpened(false)
          }}
          tumIdToDeveloperApplicationMap={tumIdToApplicationMap}
        />
        {filters.applicationType.length === 1 && (
          <MatchingResultsUploadModal
            opened={matchingResultsUploadModalOpened}
            onClose={() => {
              setMatchingResultsUploadModalOpened(false)
            }}
            tumIdToApplicationMap={tumIdToApplicationMap}
            matriculationNumberToApplicationMap={matriculationNumberToApplicationMap}
            applicationType={filters.applicationType[0]}
          />
        )}
      </Group>
      <ApplicationDatatable
        developerApplications={developerApplications}
        coachApplications={coachApplications}
        tutorApplications={tutorApplications}
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
      />
    </Stack>
  )
}
