import { Alert, Tabs } from '@mantine/core'
import { IconAlertCircle, IconUsersGroup } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { ProjectTeamGrading } from './components/ProjectTeamGrading'
import { useQuery } from '@tanstack/react-query'
import { useProjectTeamStore } from '../../state/zustand/useProjectTeamStore'
import { getProjectTeams } from '../../network/projectTeam'
import { Query } from '../../state/query'
import { useCourseIterationStore } from '../../state/zustand/useCourseIterationStore'
import { ProjectTeam } from '../../interface/projectTeam'
import { useAuthenticationStore } from '../../state/zustand/useAuthenticationStore'
import { Permission } from '../../interface/authentication'
import { Link } from 'react-router-dom'

export const GradingManagementConsole = (): JSX.Element => {
  const { user, permissions } = useAuthenticationStore()
  const { projectTeams, setProjectTeams } = useProjectTeamStore()
  const { selectedCourseIteration } = useCourseIterationStore()
  const [activeProjectTeam, setActiveProjectTeam] = useState<string | null>()

  const { data: fetchedProjectTeams } = useQuery<ProjectTeam[]>({
    queryKey: [Query.PROJECT_TEAM, selectedCourseIteration?.semesterName],
    queryFn: () => getProjectTeams(selectedCourseIteration?.semesterName ?? ''),
    enabled: !!selectedCourseIteration,
  })

  useEffect(() => {
    if (fetchedProjectTeams) {
      if (permissions.includes(Permission.PM)) {
        setProjectTeams(fetchedProjectTeams)
      } else {
        setProjectTeams(
          fetchedProjectTeams.filter(
            (projectTeam) =>
              projectTeam.coachTumId === user?.username ||
              projectTeam.projectLeadTumId === user?.username,
          ),
        )
      }
    }
  }, [fetchedProjectTeams, permissions, setProjectTeams, user?.username])

  return (
    <>
      {projectTeams.length > 0 ? (
        <Tabs
          defaultValue={projectTeams.at(0)?.id}
          variant='outline'
          value={activeProjectTeam}
          onChange={setActiveProjectTeam}
        >
          <Tabs.List>
            {projectTeams.map((projectTeam) => {
              return (
                <Tabs.Tab
                  key={projectTeam.id}
                  value={projectTeam.id}
                  leftSection={<IconUsersGroup />}
                >
                  {projectTeam.name}
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
          {projectTeams.map((projectTeam) => {
            return (
              <Tabs.Panel value={projectTeam.id} key={projectTeam.id}>
                <ProjectTeamGrading projectTeamId={projectTeam.id} />
              </Tabs.Panel>
            )
          })}
        </Tabs>
      ) : (
        <Alert icon={<IconAlertCircle size='1rem' />} title='Action required!' color='red'>
          You have not declared any project teams for the current semester. Please visit the{' '}
          <Link to='/management/team-allocation'>Project Management</Link> console and create a
          project team!
        </Alert>
      )}
    </>
  )
}
