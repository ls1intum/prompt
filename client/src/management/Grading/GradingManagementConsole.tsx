import { Tabs } from '@mantine/core'
import { IconUsersGroup } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { ProjectTeamGrading } from './components/ProjectTeamGrading'
import { useQuery } from '@tanstack/react-query'
import { useProjectTeamStore } from '../../state/zustand/useProjectTeamStore'
import { getProjectTeams } from '../../network/projectTeam'
import { Query } from '../../state/query'
import { useCourseIterationStore } from '../../state/zustand/useCourseIterationStore'
import { ProjectTeam } from '../../interface/projectTeam'

export const GradingManagementConsole = (): JSX.Element => {
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
      setProjectTeams(fetchedProjectTeams)
    }
  }, [fetchedProjectTeams, setProjectTeams])

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
