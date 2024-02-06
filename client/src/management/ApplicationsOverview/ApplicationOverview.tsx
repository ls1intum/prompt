import { Group, TextInput, Checkbox, Stack, Button, Menu, Tooltip } from '@mantine/core'
import { IconAdjustments, IconSearch } from '@tabler/icons-react'
import { useState, useMemo, useEffect } from 'react'
import { TechnicalChallengeAssessmentModal } from './components/TechnicalChallengeAssessmentModal'
import { ApplicationDatatable } from './components/ApplicationDatatable'
import { MatchingResultsUploadModal } from './components/MatchingResultsUploadModal'
import { useApplicationStore } from '../../state/zustand/useApplicationStore'
import { useQuery } from '@tanstack/react-query'
import { Application, ApplicationType } from '../../interface/application'
import { Query } from '../../state/query'
import { getApplications } from '../../network/application'
import { useCourseIterationStore } from '../../state/zustand/useCourseIterationStore'

export interface Filters {
  male: boolean
  female: boolean
  status: string[]
  applicationType: ApplicationType[]
}

export const StudentApplicationOverview = (): JSX.Element => {
  const { selectedCourseIteration } = useCourseIterationStore()
  const {
    developerApplications,
    coachApplications,
    tutorApplications,
    setDeveloperApplications,
    setCoachApplications,
    setTutorApplications,
  } = useApplicationStore()
  const [technicalChallengeAssessmentModalOpened, setTechnicalChallengeAssessmentModalOpened] =
    useState(false)
  const [matchingResultsUploadModalOpened, setMatchingResultsUploadModalOpened] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({
    male: false,
    female: false,
    status: [],
    applicationType: [ApplicationType.DEVELOPER],
  })

  const { data: fetchedDeveloperApplications, isLoading: isLoadingDeveloperApplications } =
    useQuery<Application[]>({
      queryKey: [Query.DEVELOPER_APPLICATION, selectedCourseIteration?.semesterName],
      queryFn: () =>
        getApplications(ApplicationType.DEVELOPER, selectedCourseIteration?.semesterName ?? ''),
      enabled: !!selectedCourseIteration,
      select: (applications) =>
        applications.map((application) => {
          return { ...application, type: ApplicationType.DEVELOPER }
        }),
    })
  const { data: fetchedCoachApplications, isLoading: isLoadingCoachApplications } = useQuery<
    Application[]
  >({
    queryKey: [Query.COACH_APPLICATION, selectedCourseIteration?.semesterName],
    queryFn: () =>
      getApplications(ApplicationType.COACH, selectedCourseIteration?.semesterName ?? ''),
    enabled: !!selectedCourseIteration,
    select: (applications) =>
      applications.map((application) => {
        return { ...application, type: ApplicationType.COACH }
      }),
  })
  const { data: fetchedTutorApplications, isLoading: isLoadingTutorApplications } = useQuery<
    Application[]
  >({
    queryKey: [Query.TUTOR_APPLICATION, selectedCourseIteration?.semesterName],
    queryFn: () =>
      getApplications(ApplicationType.TUTOR, selectedCourseIteration?.semesterName ?? ''),
    enabled: !!selectedCourseIteration,
    select: (applications) =>
      applications.map((application) => {
        return { ...application, type: ApplicationType.TUTOR }
      }),
  })

  useEffect(() => {
    if (fetchedDeveloperApplications) {
      setDeveloperApplications(fetchedDeveloperApplications)
    }
  }, [fetchedDeveloperApplications, setDeveloperApplications])
  useEffect(() => {
    if (fetchedCoachApplications) {
      setCoachApplications(fetchedCoachApplications)
    }
  }, [fetchedCoachApplications, setCoachApplications])
  useEffect(() => {
    if (fetchedTutorApplications) {
      setTutorApplications(fetchedTutorApplications)
    }
  }, [fetchedTutorApplications, setTutorApplications])

  const tumIdToApplicationMap = useMemo(() => {
    const map = new Map<string, string>()
    if (filters.applicationType.includes(ApplicationType.DEVELOPER)) {
      developerApplications.forEach((application) => {
        if (application.student.tumId) {
          map.set(application.student.tumId, application.id)
        }
      })
    } else if (filters.applicationType.includes(ApplicationType.COACH)) {
      coachApplications.forEach((application) => {
        if (application.student.tumId) {
          map.set(application.student.tumId, application.id)
        }
      })
    } else if (filters.applicationType.includes(ApplicationType.TUTOR)) {
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
    if (filters.applicationType.includes(ApplicationType.DEVELOPER)) {
      developerApplications.forEach((application) => {
        if (application.student.matriculationNumber) {
          map.set(application.student.matriculationNumber, application.id)
        }
      })
    } else if (filters.applicationType.includes(ApplicationType.COACH)) {
      coachApplications.forEach((application) => {
        if (application.student.matriculationNumber) {
          map.set(application.student.matriculationNumber, application.id)
        }
      })
    } else if (filters.applicationType.includes(ApplicationType.TUTOR)) {
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
                  !filters.applicationType.includes(ApplicationType.DEVELOPER)
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
        isLoading={
          isLoadingDeveloperApplications || isLoadingCoachApplications || isLoadingTutorApplications
        }
      />
    </Stack>
  )
}
