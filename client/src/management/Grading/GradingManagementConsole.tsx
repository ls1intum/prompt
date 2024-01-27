import { Tabs } from '@mantine/core'
import { IconUsersGroup } from '@tabler/icons-react'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { fetchProjectTeams } from '../../redux/projectTeamsSlice/thunks/fetchProjectTeams'
import { fetchProjectTeamDevelopers } from '../../redux/projectTeamsSlice/thunks/fetchProjectTeamDevelopers'
import { ProjectTeamGrading } from './components/ProjectTeamGrading'

export const GradingManagementConsole = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const projectTeams = useAppSelector((state) => state.projectTeams.projectTeams)
  const [activeProjectTeam, setActiveProjectTeam] = useState<string | null>()

  useEffect(() => {
    if (selectedCourseIteration) {
      void dispatch(fetchProjectTeams(selectedCourseIteration?.semesterName))
    }
  }, [dispatch, selectedCourseIteration])

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
