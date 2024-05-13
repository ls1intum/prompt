import { Alert, Button, Stack, Tabs } from '@mantine/core'
import { ProjectTeamsManager } from './components/ProjectTeamsManager/ProjectTeamsManager'
import {
  IconAbacus,
  IconAlertCircle,
  IconChartArrowsVertical,
  IconListNumbers,
  IconUsers,
} from '@tabler/icons-react'
import { StudentProjectTeamPreferencesManager } from './components/StudentProjectTeamPreferencesManager/StudentProjectTeamPreferencesManager'
import { SkillsManager } from './components/SkillsManager/SkillsManager'
import { Link } from 'react-router-dom'
import { useEffect } from 'react'
import { useProjectTeamStore } from '../../state/zustand/useProjectTeamStore'
import { useQuery } from '@tanstack/react-query'
import { Query } from '../../state/query'
import { getProjectTeams } from '../../network/projectTeam'
import { useCourseIterationStore } from '../../state/zustand/useCourseIterationStore'
import { ProjectTeam } from '../../interface/projectTeam'
import { useIntroCourseStore } from '../../state/zustand/useIntroCourseStore'
import { IntroCourseParticipation } from '../../interface/introCourse'
import { getIntroCourseParticipations } from '../../network/introCourse'
import { usePostKickOffSubmissionStore } from '../../state/zustand/usePostKickOffSubmissionStore'
import { StudentPostKickoffSubmission } from '../../interface/postKickOffSubmission'
import { getPostKickOffSubmissions } from '../../network/postKickOffSubmission'

export const TeamAllocationConsole = (): JSX.Element => {
  const { setProjectTeams } = useProjectTeamStore()
  const { setParticipations } = useIntroCourseStore()
  const { setPostKickOffSubmissions } = usePostKickOffSubmissionStore()
  const { selectedCourseIteration } = useCourseIterationStore()

  const { data: projectTeams } = useQuery<ProjectTeam[]>({
    queryKey: [Query.PROJECT_TEAM, selectedCourseIteration?.semesterName],
    queryFn: () => getProjectTeams(selectedCourseIteration?.semesterName ?? ''),
    enabled: !!selectedCourseIteration,
  })

  useEffect(() => {
    if (projectTeams) {
      setProjectTeams(projectTeams)
    }
  }, [projectTeams, setProjectTeams])

  const { data: participations } = useQuery<IntroCourseParticipation[]>({
    queryKey: [Query.INTRO_COURSE_PARTICIPATIONS, selectedCourseIteration?.semesterName],
    queryFn: () => getIntroCourseParticipations(selectedCourseIteration?.semesterName ?? ''),
    enabled: !!selectedCourseIteration,
  })

  useEffect(() => {
    if (participations) {
      setParticipations(participations)
    }
  }, [participations, setParticipations])

  const { data: postKickOffSubmissions } = useQuery<StudentPostKickoffSubmission[]>({
    queryKey: [Query.POST_KICK_OFF, selectedCourseIteration?.semesterName],
    queryFn: () => getPostKickOffSubmissions(selectedCourseIteration?.semesterName ?? ''),
    enabled: !!selectedCourseIteration,
  })

  useEffect(() => {
    if (postKickOffSubmissions) {
      setPostKickOffSubmissions(postKickOffSubmissions)
    }
  }, [postKickOffSubmissions, setPostKickOffSubmissions])

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
      <Button
        leftSection={<IconAbacus />}
        component='a'
        href={window.location.origin + '/tease'}
        target='_blank'
      >
        TEASE
      </Button>
      <Tabs defaultValue='teams'>
        <Tabs.List grow>
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
