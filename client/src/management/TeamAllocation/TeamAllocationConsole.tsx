import { Alert, Stack, Tabs } from '@mantine/core'
import { ProjectTeamsManager } from './components/ProjectTeamsManager/ProjectTeamsManager'
import {
  IconAlertCircle,
  IconChartArrowsVertical,
  IconListNumbers,
  IconUsers,
} from '@tabler/icons-react'
import { StudentProjectTeamPreferencesManager } from './components/StudentProjectTeamPreferencesManager/StudentProjectTeamPreferencesManager'
import { SkillsManager } from './components/SkillsManager/SkillsManager'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import { Link } from 'react-router-dom'
import { fetchDeveloperApplications } from '../../redux/applicationsSlice/thunks/fetchApplications'
import { useDispatch } from 'react-redux'
import { fetchProjectTeams } from '../../redux/projectTeamsSlice/thunks/fetchProjectTeams'
import { useEffect } from 'react'
import { fetchStudentPostKickoffSubmissions } from '../../redux/studentPostKickoffSubmissionsSlice/thunks/fetchStudentPostKickoffSubmissions'
import { fetchIntroCourseParticipations } from '../../redux/introCourseSlice/thunks/fetchIntroCourseParticipations'

export const TeamAllocationConsole = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)

  useEffect(() => {
    if (selectedCourseIteration) {
      void dispatch(
        fetchDeveloperApplications({
          courseIteration: selectedCourseIteration.semesterName,
          status: 'INTRO_COURSE_PASSED',
        }),
      )
      void dispatch(fetchProjectTeams(selectedCourseIteration.semesterName))
      void dispatch(fetchStudentPostKickoffSubmissions(selectedCourseIteration.semesterName))
      void dispatch(fetchIntroCourseParticipations(selectedCourseIteration.semesterName))
    }
  }, [dispatch, selectedCourseIteration])

  return (
    <Stack>
      {(!selectedCourseIteration?.kickoffSubmissionPeriodStart ||
        !selectedCourseIteration.kickoffSubmissionPeriodEnd) && (
        <Alert icon={<IconAlertCircle size='1rem' />} title='Action required!' color='red'>
          You have not specified the Kickoff submission period for the current semester. Please
          visit the <Link to='/management/course-iterations'>Course Iteration Management</Link>{' '}
          console and specify the dates!
        </Alert>
      )}
      <Tabs defaultValue='teams' variant='outline'>
        <Tabs.List>
          <Tabs.Tab value='teams' leftSection={<IconUsers />}>
            Project Teams Management
          </Tabs.Tab>
          <Tabs.Tab value='preferences' leftSection={<IconListNumbers />}>
            Student Project Team Preferences
          </Tabs.Tab>
          <Tabs.Tab value='skills' leftSection={<IconChartArrowsVertical />}>
            Skills Manager
          </Tabs.Tab>
        </Tabs.List>
        <Tabs.Panel value='teams'>
          <ProjectTeamsManager />
        </Tabs.Panel>
        <Tabs.Panel value='preferences'>
          <StudentProjectTeamPreferencesManager />
        </Tabs.Panel>
        <Tabs.Panel value='skills'>
          <SkillsManager />
        </Tabs.Panel>
      </Tabs>
    </Stack>
  )
}
