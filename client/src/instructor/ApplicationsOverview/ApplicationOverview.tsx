import { Group, TextInput, Checkbox, Stack, Button, Menu, Tooltip } from '@mantine/core'
import { IconAdjustments, IconSearch } from '@tabler/icons-react'
import { useState, useEffect, useMemo } from 'react'
import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import {
  fetchDeveloperApplications,
  fetchCoachApplications,
  fetchTutorApplications,
} from '../../redux/applicationsSlice/thunks/fetchApplications'
import { TechnicalChallengeAssessmentModal } from './components/TechnicalChallengeAssessmentModal'
import { ApplicationDatatable } from './components/ApplicationDatatable'

export interface Filters {
  accepted: boolean
  rejected: boolean
  notAssessed: boolean
  male: boolean
  female: boolean
  applicationType: string[]
}

export const StudentApplicationOverview = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const developerApplications = useAppSelector((state) => state.applications.developerApplications)
  const coachApplications = useAppSelector((state) => state.applications.coachApplications)
  const tutorApplications = useAppSelector((state) => state.applications.tutorApplications)
  const [technicalChallengeAssessmentModalOpened, setTechnicalChallengeAssessmentModalOpened] =
    useState(false)
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const [searchQuery, setSearchQuery] = useState('')
  const [filters, setFilters] = useState<Filters>({
    accepted: false,
    rejected: false,
    notAssessed: false,
    male: false,
    female: false,
    applicationType: ['DEVELOPER'],
  })

  useEffect(() => {
    if (selectedCourseIteration) {
      void dispatch(
        fetchDeveloperApplications({ courseIteration: selectedCourseIteration.semesterName }),
      )
      void dispatch(
        fetchCoachApplications({ courseIteration: selectedCourseIteration.semesterName }),
      )
      void dispatch(
        fetchTutorApplications({ courseIteration: selectedCourseIteration.semesterName }),
      )
    }
  }, [selectedCourseIteration])

  const tumIdToDeveloperApplicationMap = useMemo(() => {
    const map = new Map<string, string>()
    developerApplications.forEach((application) => {
      if (application.student.tumId) {
        map.set(application.student.tumId, application.id)
      }
    })
    return map
  }, [developerApplications])

  return (
    <Stack>
      <Group position='apart'>
        <Group position='left'>
          <TextInput
            sx={{ margin: '1vh 0', width: '30vw' }}
            placeholder='Search applications...'
            icon={<IconSearch size={16} />}
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
                  label='Accepted'
                  checked={filters.accepted}
                  onChange={(e) => {
                    setFilters({ ...filters, accepted: e.currentTarget.checked })
                  }}
                />
              </Menu.Item>
              <Menu.Item>
                <Checkbox
                  label='Rejected'
                  checked={filters.rejected}
                  onChange={(e) => {
                    setFilters({ ...filters, rejected: e.currentTarget.checked })
                  }}
                />
              </Menu.Item>
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
              <Menu.Item>
                <Checkbox
                  label='Not Assessed'
                  checked={filters.notAssessed}
                  onChange={(e) => {
                    setFilters({ ...filters, notAssessed: e.currentTarget.checked })
                  }}
                />
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
        <Tooltip
          withArrow
          color='blue'
          label="To start automatic assessment of developer applications based on the technical challenge score, please select solely 'Developer' sorting filter"
        >
          <div>
            <Button
              disabled={
                filters.applicationType.length > 1 || !filters.applicationType.includes('DEVELOPER')
              }
              onClick={() => {
                setTechnicalChallengeAssessmentModalOpened(true)
              }}
            >
              Technical Challenge Assessment
            </Button>
          </div>
        </Tooltip>
        <TechnicalChallengeAssessmentModal
          opened={technicalChallengeAssessmentModalOpened}
          onClose={() => {
            setTechnicalChallengeAssessmentModalOpened(false)
          }}
          tumIdToDeveloperApplicationMap={tumIdToDeveloperApplicationMap}
        />
      </Group>
      <ApplicationDatatable
        applications={[...developerApplications, ...coachApplications, ...tutorApplications]}
        filters={filters}
        setFilters={setFilters}
        searchQuery={searchQuery}
      />
    </Stack>
  )
}
