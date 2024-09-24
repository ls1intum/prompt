import {
  Group,
  TextInput,
  Stack,
  Button,
  Menu,
  Tooltip,
  SegmentedControl,
  Center,
} from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useState, useMemo, useEffect } from 'react'
import { TechnicalChallengeAssessmentModal } from './components/TechnicalChallengeAssessmentModal'
import { ApplicationDatatable } from './components/ApplicationDatatable'
import { MatchingResultsUploadModal } from './components/MatchingResultsUploadModal'
import { useApplicationStore } from '../../state/zustand/useApplicationStore'
import { useQuery } from '@tanstack/react-query'
import { Application, ApplicationType, Gender } from '../../interface/application'
import { Query } from '../../state/query'
import { getApplications } from '../../network/application'
import { useCourseIterationStore } from '../../state/zustand/useCourseIterationStore'
import { FilterChips } from './components/FilterChips'
import { FilterMenu } from './components/FilterMenu'

export interface Filters {
  gender: Gender[]
  status: string[]
  assessment: {
    noScore: boolean
    minScore: number
    maxScore: number
  }
  applicationType: ApplicationType
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
    gender: [],
    status: [],
    assessment: {
      noScore: false,
      minScore: 0,
      maxScore: 100,
    },
    applicationType: ApplicationType.DEVELOPER,
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
    if (filters.applicationType === ApplicationType.DEVELOPER) {
      developerApplications.forEach((application) => {
        if (application.student.tumId) {
          map.set(application.student.tumId, application.id)
        }
      })
    } else if (filters.applicationType === ApplicationType.COACH) {
      coachApplications.forEach((application) => {
        if (application.student.tumId) {
          map.set(application.student.tumId, application.id)
        }
      })
    } else if (filters.applicationType === ApplicationType.TUTOR) {
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
    if (filters.applicationType === ApplicationType.DEVELOPER) {
      developerApplications.forEach((application) => {
        if (application.student.matriculationNumber) {
          map.set(application.student.matriculationNumber, application.id)
        }
      })
    } else if (filters.applicationType === ApplicationType.COACH) {
      coachApplications.forEach((application) => {
        if (application.student.matriculationNumber) {
          map.set(application.student.matriculationNumber, application.id)
        }
      })
    } else if (filters.applicationType === ApplicationType.TUTOR) {
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
      <Group>
        <TextInput
          style={{ margin: '1vh 0', width: '40vw' }}
          placeholder='Search applications...'
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.currentTarget.value)
          }}
        />

        <FilterMenu filters={filters} setFilters={setFilters} />

        <Menu withArrow>
          <Menu.Target>
            <Button>Actions</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              //disabled={filters.applicationType.length !== 1}
              onClick={() => {
                setMatchingResultsUploadModalOpened(true)
              }}
            >
              Upload Matching Results
            </Menu.Item>
            <Tooltip
              withArrow
              color='blue'
              label="To start automatic assessment of developer applications based on the 
            technical challenge score, please select solely 'Developer' sorting filter"
            >
              <Menu.Item
                disabled={filters.applicationType !== ApplicationType.DEVELOPER}
                onClick={() => {
                  setTechnicalChallengeAssessmentModalOpened(true)
                }}
              >
                Technical Challenge Assessment
              </Menu.Item>
            </Tooltip>
          </Menu.Dropdown>
        </Menu>
        <TechnicalChallengeAssessmentModal
          opened={technicalChallengeAssessmentModalOpened}
          onClose={() => {
            setTechnicalChallengeAssessmentModalOpened(false)
          }}
          tumIdToDeveloperApplicationMap={tumIdToApplicationMap}
        />
        <MatchingResultsUploadModal
          opened={matchingResultsUploadModalOpened}
          onClose={() => {
            setMatchingResultsUploadModalOpened(false)
          }}
          tumIdToApplicationMap={tumIdToApplicationMap}
          matriculationNumberToApplicationMap={matriculationNumberToApplicationMap}
          applicationType={filters.applicationType}
        />
      </Group>

      <FilterChips filters={filters} setFilters={setFilters} />

      <SegmentedControl
        value={filters.applicationType.toUpperCase() as keyof typeof ApplicationType}
        onChange={(selectedApplication) =>
          setFilters((oldFilters) => {
            return {
              ...oldFilters,
              applicationType: ApplicationType[selectedApplication],
            }
          })
        }
        data={Object.keys(ApplicationType).map((applicationKey) => ({
          value: applicationKey.toString(),
          label: (
            <Center style={{ gap: 10 }}>
              <span>
                {ApplicationType[applicationKey].charAt(0).toUpperCase() +
                  ApplicationType[applicationKey].slice(1).toLowerCase()}
              </span>
            </Center>
          ),
        }))}
      />

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
