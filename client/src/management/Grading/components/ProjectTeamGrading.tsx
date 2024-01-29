import { useEffect, useState } from 'react'
import { useAppSelector } from '../../../redux/store'
import { StudentGradingForm } from './StudentGradingForm'
import { Tabs, Text } from '@mantine/core'
import { type Application } from '../../../interface/application'

interface ProjectTeamGradingProps {
  projectTeamId: string
}

export const ProjectTeamGrading = ({ projectTeamId }: ProjectTeamGradingProps): JSX.Element => {
  const status = useAppSelector((state) => state.projectTeams.status)
  const projectTeam = useAppSelector((state) =>
    state.projectTeams.projectTeams.find((team) => team.id === projectTeamId),
  )
  const [selectedDeveloperApplicationId, setSelectedDeveloperApplicationId] = useState<
    string | null
  >()
  const [selectedDeveloperApplication, setSelectedDeveloperApplication] =
    useState<Application | null>()

  useEffect(() => {
    if (projectTeam && selectedDeveloperApplicationId) {
      setSelectedDeveloperApplication(
        projectTeam.developers?.find(
          (application) => application.id === selectedDeveloperApplicationId,
        ),
      )
    }
  }, [projectTeam, selectedDeveloperApplicationId])

  return (
    <div style={{ margin: '10vh 5vw' }}>
      {status !== 'loading' &&
        (!projectTeam?.developers || projectTeam?.developers?.length === 0) && (
          <Text c='dimmed' fw={500}>{`No developers are assigned to ${
            projectTeam?.customer ?? ''
          } project team.`}</Text>
        )}
      {projectTeam?.developers && (
        <Tabs
          orientation='vertical'
          placement='right'
          variant='pills'
          value={selectedDeveloperApplicationId}
          onChange={setSelectedDeveloperApplicationId}
        >
          <Tabs.List>
            {projectTeam.developers.map((developerApplication) => {
              return (
                <Tabs.Tab key={developerApplication.id} value={developerApplication.id}>
                  {`${developerApplication.student.firstName} ${developerApplication.student.lastName}`}
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
          {projectTeam.developers.map((developerApplication) => {
            return (
              <Tabs.Panel value={developerApplication.id} key={developerApplication.id}>
                {selectedDeveloperApplication && selectedDeveloperApplication && (
                  <div style={{ margin: '0 2vw' }}>
                    <StudentGradingForm application={selectedDeveloperApplication} />
                  </div>
                )}
              </Tabs.Panel>
            )
          })}
        </Tabs>
      )}
    </div>
  )
}
