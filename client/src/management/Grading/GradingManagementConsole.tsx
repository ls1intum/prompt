import { Tabs } from '@mantine/core'
import { IconUsersGroup } from '@tabler/icons-react'
import { type AppDispatch } from '../../redux/store'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProjectTeamDevelopers } from '../../redux/projectTeamsSlice/thunks/fetchProjectTeamDevelopers'
import { ProjectTeamGrading } from './components/ProjectTeamGrading'
import { useQuery } from '@tanstack/react-query'
import { useProjectTeamStore } from '../../state/zustand/useProjectTeamStore'
import { ProjectTeam } from '../../redux/projectTeamsSlice/projectTeamsSlice'
import { getProjectTeams } from '../../network/projectTeam'
import { Query } from '../../state/query'
import { useCourseIterationStore } from '../../state/zustand/useCourseIterationStore'

export const GradingManagementConsole = (): JSX.Element => {
  const { projectTeams, setProjectTeams } = useProjectTeamStore()
  const dispatch = useDispatch<AppDispatch>()
  const { selectedCourseIteration } = useCourseIterationStore()
  const [activeProjectTeam, setActiveProjectTeam] = useState<string | null>()

  const { data: fetchedProjectTeams } = useQuery<ProjectTeam[]>({
    queryKey: [Query.PROJECT_TEAM, selectedCourseIteration?.semesterName],
    queryFn: () => getProjectTeams(selectedCourseIteration?.semesterName ?? ''),
    enabled: !!selectedCourseIteration,
  })

  useEffect(() => {
    if (fetchedProjectTeams) {
      setProjectTeams(fetchedProjectTeams)
    }
  }, [fetchedProjectTeams, setProjectTeams])

  useEffect(() => {
    if (activeProjectTeam) {
      void dispatch(fetchProjectTeamDevelopers(activeProjectTeam))
    }
  }, [activeProjectTeam, dispatch])

  return (
    <Tabs
      defaultValue={projectTeams.at(0)?.id}
      variant='outline'
      value={activeProjectTeam}
      onChange={setActiveProjectTeam}
    >
      <Tabs.List>
        {projectTeams.map((projectTeam) => {
          return (
            <Tabs.Tab key={projectTeam.id} value={projectTeam.id} leftSection={<IconUsersGroup />}>
              {projectTeam.name}
            </Tabs.Tab>
          )
        })}
      </Tabs.List>
      {projectTeams.map((projectTeam) => {
        return (
          <Tabs.Panel value={projectTeam.id} key={projectTeam.id}>
            {activeProjectTeam && <ProjectTeamGrading projectTeamId={activeProjectTeam} />}
          </Tabs.Panel>
        )
      })}
    </Tabs>
  )
}
