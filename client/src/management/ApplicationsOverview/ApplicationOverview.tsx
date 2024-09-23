import {
  Group,
  TextInput,
  Checkbox,
  Stack,
  Button,
  Menu,
  Tooltip,
  NumberInput,
} from '@mantine/core'
import { IconAdjustments, IconSearch } from '@tabler/icons-react'
import { useState, useMemo, useEffect } from 'react'
import { TechnicalChallengeAssessmentModal } from './components/TechnicalChallengeAssessmentModal'
import { ApplicationDatatable } from './components/ApplicationDatatable'
import { MatchingResultsUploadModal } from './components/MatchingResultsUploadModal'
import { useApplicationStore } from '../../state/zustand/useApplicationStore'
import { useQuery } from '@tanstack/react-query'
import {
  Application,
  ApplicationStatus,
  ApplicationType,
  Gender,
} from '../../interface/application'
import { Query } from '../../state/query'
import { getApplications } from '../../network/application'
import { useCourseIterationStore } from '../../state/zustand/useCourseIterationStore'
import { FilterChips } from './components/FilterChips'

export interface Filters {
  gender: Gender[]
  status: string[]
  assessment: {
    noScore: boolean
    minScore: number
    maxScore: number
  }
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
    gender: [],
    status: [],
    assessment: {
      noScore: false,
      minScore: 0,
      maxScore: 100,
    },
    applicationType: [ApplicationType.DEVELOPER],
  })

  const applicationStatusOptions = Object.values(ApplicationStatus)

  const handleStatusFilterChange = (status: string, checked: boolean) => {
    setFilters((currFilters) => ({
      ...currFilters,
      status: checked
        ? [...currFilters.status, status]
        : currFilters.status.filter((existingStatus) => existingStatus !== status.toString()),
    }))
  }

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
        <Menu withArrow closeOnItemClick={false}>
          <Menu.Target>
            <IconAdjustments />
          </Menu.Target>
          <Menu.Dropdown>
            <Menu.Label>Gender</Menu.Label>
            <Menu.Item>
              <Checkbox
                label='Male'
                checked={filters.gender.includes(Gender.MALE)}
                onChange={(e) => {
                  setFilters((currFilters) => ({
                    ...currFilters,
                    gender: e.currentTarget.checked
                      ? [...currFilters.gender, Gender.MALE]
                      : currFilters.gender.filter((gender) => gender !== Gender.MALE),
                  }))
                }}
              />
            </Menu.Item>
            <Menu.Item>
              <Checkbox
                label='Female'
                checked={filters.gender.includes(Gender.FEMALE)}
                onChange={(e) => {
                  setFilters((currFilters) => ({
                    ...currFilters,
                    gender: e.currentTarget.checked
                      ? [...currFilters.gender, Gender.FEMALE]
                      : currFilters.gender.filter((gender) => gender !== Gender.FEMALE),
                  }))
                }}
              />
            </Menu.Item>
            <Menu.Item>
              <Checkbox
                label='Unkown / Other'
                checked={
                  filters.gender.includes(Gender.PREFER_NOT_TO_SAY) ||
                  filters.gender.includes(Gender.OTHER)
                }
                onChange={(e) => {
                  setFilters((currFilters) => ({
                    ...currFilters,
                    gender: e.currentTarget.checked
                      ? [...currFilters.gender, Gender.OTHER]
                      : currFilters.gender.filter((gender) => gender !== Gender.OTHER),
                  }))
                }}
              />
            </Menu.Item>

            <Menu.Divider />
            <Menu.Label>Assessment</Menu.Label>
            <Menu.Item>
              <Checkbox
                label='No Score'
                checked={filters.assessment.noScore}
                onChange={(e) => {
                  setFilters((oldFilters: Filters) => {
                    return {
                      ...oldFilters,
                      assessment: {
                        minScore: 0,
                        maxScore: 100,
                        noScore: e.currentTarget.checked,
                      },
                    }
                  })
                }}
              />
            </Menu.Item>
            <Menu.Item>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <NumberInput
                  description='Min Score'
                  placeholder='0'
                  value={filters.assessment.minScore}
                  min={0}
                  max={100}
                  onChange={(value) => {
                    setFilters((oldFilters: Filters) => {
                      return {
                        ...oldFilters,
                        assessment: {
                          minScore: +value,
                          noScore: +value > 0 ? false : oldFilters.assessment.noScore,
                          maxScore: oldFilters.assessment.noScore
                            ? 100
                            : oldFilters.assessment.maxScore,
                        },
                      }
                    })
                  }}
                  style={{
                    width: '6rem',
                  }}
                  styles={{
                    input: {
                      color: filters.assessment.minScore === 0 ? 'darkgray' : 'black',
                      opacity: filters.assessment.minScore === 0 ? 0.8 : 1,
                    },
                    description: {
                      color: 'black',
                    },
                  }}
                />
                <NumberInput
                  description='Max Score'
                  placeholder='100'
                  value={filters.assessment.maxScore}
                  min={0}
                  max={100}
                  onChange={(value) => {
                    setFilters((oldFilters: Filters) => {
                      return {
                        ...oldFilters,
                        assessment: {
                          ...oldFilters.assessment,
                          maxScore: +value,
                          noScore: +value > 0 ? false : oldFilters.assessment.noScore,
                        },
                      }
                    })
                  }}
                  style={{ width: '6rem' }}
                  styles={{
                    input: {
                      color: filters.assessment.maxScore === 100 ? 'darkgray' : 'black',
                      opacity: filters.assessment.maxScore === 100 ? 0.8 : 1,
                    },
                    description: {
                      color: 'black',
                    },
                  }}
                />
              </div>
            </Menu.Item>

            <Menu.Divider />
            <Menu.Label>Assessment</Menu.Label>
            {Object.keys(ApplicationStatus).map((status) => (
              <Menu.Item key={status}>
                <Checkbox
                  label={ApplicationStatus[status]}
                  checked={filters.status.includes(status)}
                  onChange={(e) => handleStatusFilterChange(status, e.currentTarget.checked)}
                />
              </Menu.Item>
            ))}

            <Menu.Divider />
            <Menu.Item>
              <Button
                variant='light'
                fullWidth
                onClick={() => {
                  setFilters((oldFilters: Filters) => {
                    return {
                      ...oldFilters,
                      gender: [],
                      status: [],
                      assessment: {
                        noScore: false,
                        minScore: 0,
                        maxScore: 100,
                      },
                    }
                  })
                }}
              >
                Reset Filters
              </Button>
            </Menu.Item>
          </Menu.Dropdown>
        </Menu>

        <Menu withArrow>
          <Menu.Target>
            <Button>Actions</Button>
          </Menu.Target>

          <Menu.Dropdown>
            <Menu.Item
              disabled={filters.applicationType.length !== 1}
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
                disabled={
                  filters.applicationType.length > 1 ||
                  !filters.applicationType.includes(ApplicationType.DEVELOPER)
                }
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

      <FilterChips filters={filters} setFilters={setFilters} />

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
