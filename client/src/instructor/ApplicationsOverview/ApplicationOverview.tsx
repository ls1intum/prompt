import { Group, TextInput, Checkbox, Select } from '@mantine/core'
import { IconSearch } from '@tabler/icons-react'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import { fetchDeveloperApplications } from '../../redux/applicationsSlice/thunks/fetchDeveloperApplications'
import { fetchCoachApplications } from '../../redux/applicationsSlice/thunks/fetchCoachApplications'
import { fetchTutorApplications } from '../../redux/applicationsSlice/thunks/fetchTutorApplications'
import { DeveloperApplicationTable } from './components/DeveloperApplicationTable'
import { CoachApplicationTable } from './components/CoachApplicationTable'
import { TutorApplicationTable } from './components/TutorApplicationTable'

export const StudentApplicationOverview = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [applicationsFilter, setApplicationsFilter] = useState<string | null>('developer')
  const developerApplications = useAppSelector((state) => state.applications.developerApplications)
  const coachApplications = useAppSelector((state) => state.applications.coachApplications)
  const tutorApplications = useAppSelector((state) => state.applications.tutorApplications)
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyNotAssessed, setShowOnlyNotAssessed] = useState(false)

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
    <>
      <Group>
        <TextInput
          sx={{ flexBasis: '40%', margin: '1vh 0' }}
          placeholder='Search student applications...'
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
        <Checkbox
          label='Show only not assessed'
          checked={showOnlyNotAssessed}
          onChange={(e) => {
            setShowOnlyNotAssessed(e.currentTarget.checked)
          }}
        />
      </Group>
      {applicationsFilter === 'developer' && (
        <DeveloperApplicationTable
          developerApplications={developerApplications}
          filterOnlyNotAssessed={showOnlyNotAssessed}
          searchQuery={searchQuery}
        />
      )}
      {applicationsFilter === 'coach' && (
        <CoachApplicationTable
          coachApplications={coachApplications}
          filterOnlyNotAssessed={showOnlyNotAssessed}
          searchQuery={searchQuery}
        />
      )}
      {applicationsFilter === 'tutor' && (
        <TutorApplicationTable
          tutorApplications={tutorApplications}
          filterOnlyNotAssessed={showOnlyNotAssessed}
          searchQuery={searchQuery}
        />
      )}
    </>
  )
}
