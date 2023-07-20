import {
  Group,
  TextInput,
  Checkbox,
  Select,
  ActionIcon,
  Stack,
  Collapse,
  Button,
} from '@mantine/core'
import { IconAdjustments, IconDownload, IconSearch } from '@tabler/icons-react'
import { useState, useEffect, useRef } from 'react'
import { useDispatch } from 'react-redux'
import { CSVLink } from 'react-csv'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import {
  fetchDeveloperApplications,
  fetchCoachApplications,
  fetchTutorApplications,
} from '../../redux/applicationsSlice/thunks/fetchApplications'
import { DeveloperApplicationTable } from './components/DeveloperApplicationTable'
import { CoachApplicationTable } from './components/CoachApplicationTable'
import { TutorApplicationTable } from './components/TutorApplicationTable'

export interface Filters {
  accepted: boolean
  rejected: boolean
  notAssessed: boolean
  male: boolean
  female: boolean
}

export const StudentApplicationOverview = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [applicationsFilter, setApplicationsFilter] = useState<string | null>('developer')
  const developerApplications = useAppSelector((state) => state.applications.developerApplications)
  const coachApplications = useAppSelector((state) => state.applications.coachApplications)
  const tutorApplications = useAppSelector((state) => state.applications.tutorApplications)
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const [searchQuery, setSearchQuery] = useState('')
  const downloadLinkRef = useRef<HTMLAnchorElement & { link: HTMLAnchorElement }>(null)
  const [filtersOpened, setFiltersOpened] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    accepted: false,
    rejected: false,
    notAssessed: false,
    male: false,
    female: false,
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

  return (
    <Stack>
      <Group>
        <Group position='left' style={{ width: '60vw' }}>
          <TextInput
            sx={{ flexBasis: '60%', margin: '1vh 0' }}
            placeholder='Search applications...'
            icon={<IconSearch size={16} />}
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.currentTarget.value)
            }}
          />
          <Select
            value={applicationsFilter}
            onChange={setApplicationsFilter}
            data={[
              { value: 'developer', label: 'Developer' },
              { value: 'coach', label: 'Coach' },
              { value: 'tutor', label: 'Tutor' },
            ]}
          />
          <ActionIcon
            onClick={() => {
              setFiltersOpened(!filtersOpened)
            }}
          >
            <IconAdjustments />
          </ActionIcon>
        </Group>
        <Group position='right'>
          <Button
            leftIcon={<IconDownload />}
            variant='filled'
            disabled={developerApplications.length === 0}
            onClick={() => {
              downloadLinkRef.current?.link?.click()
            }}
          >
            Download
          </Button>
          <CSVLink
            data={(applicationsFilter === 'developer'
              ? developerApplications
              : applicationsFilter === 'coach'
              ? coachApplications
              : tutorApplications
            )?.map((da) => {
              return {
                firstName: da.student.firstName,
                lastName: da.student.lastName,
                matriculationNumber: da.student.matriculationNumber,
                assessmentScore: da.assessment?.assessmentScore,
              }
            })}
            filename='data.csv'
            style={{ display: 'hidden' }}
            ref={downloadLinkRef}
            target='_blank'
          />
        </Group>
      </Group>
      <Collapse in={filtersOpened} transitionDuration={500}>
        <Stack>
          <Group>
            <Checkbox
              label='Accepted'
              checked={filters.accepted}
              onChange={(e) => {
                setFilters({ ...filters, accepted: e.currentTarget.checked })
              }}
            />
            <Checkbox
              label='Rejected'
              checked={filters.rejected}
              onChange={(e) => {
                setFilters({ ...filters, rejected: e.currentTarget.checked })
              }}
            />
            <Checkbox
              label='Male'
              checked={filters.male}
              onChange={(e) => {
                setFilters({ ...filters, male: e.currentTarget.checked })
              }}
            />
            <Checkbox
              label='Female'
              checked={filters.female}
              onChange={(e) => {
                setFilters({ ...filters, female: e.currentTarget.checked })
              }}
            />
            <Checkbox
              label='Not Assessed'
              checked={filters.notAssessed}
              onChange={(e) => {
                setFilters({ ...filters, notAssessed: e.currentTarget.checked })
              }}
            />
          </Group>
        </Stack>
      </Collapse>
      {applicationsFilter === 'developer' && (
        <DeveloperApplicationTable
          developerApplications={developerApplications}
          filters={filters}
          searchQuery={searchQuery}
        />
      )}
      {applicationsFilter === 'coach' && (
        <CoachApplicationTable
          coachApplications={coachApplications}
          filters={filters}
          searchQuery={searchQuery}
        />
      )}
      {applicationsFilter === 'tutor' && (
        <TutorApplicationTable
          tutorApplications={tutorApplications}
          filters={filters}
          searchQuery={searchQuery}
        />
      )}
    </Stack>
  )
}
