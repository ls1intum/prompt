import { useEffect, useState } from 'react'
import { StudentGradingForm } from './StudentGradingForm'
import { Tabs, Text } from '@mantine/core'
import { type Application } from '../../../interface/application'
import { useQuery } from '@tanstack/react-query'
import { Query } from '../../../state/query'
import { getDeveloperApplicationsByProjectTeam } from '../../../network/application'
import { useProjectTeamStore } from '../../../state/zustand/useProjectTeamStore'

interface ProjectTeamGradingProps {
  projectTeamId: string
}

export const ProjectTeamGrading = ({ projectTeamId }: ProjectTeamGradingProps): JSX.Element => {
  const projectTeam = useProjectTeamStore((state) =>
    state.projectTeams.find((pt) => pt.id === projectTeamId),
  )
  const [selectedDeveloperApplicationId, setSelectedDeveloperApplicationId] = useState<
    string | null
  >()
  const [selectedDeveloperApplication, setSelectedDeveloperApplication] =
    useState<Application | null>()

  const { data: developerApplications, isLoading } = useQuery({
    queryKey: [Query.DEVELOPER_APPLICATION, projectTeamId],
    queryFn: () => getDeveloperApplicationsByProjectTeam(projectTeamId),
  })
  useEffect(() => {
    if (projectTeam && selectedDeveloperApplicationId) {
      setSelectedDeveloperApplication(
        developerApplications?.find(
          (application) => application.id === selectedDeveloperApplicationId,
        ),
      )
    }
  }, [developerApplications, projectTeam, selectedDeveloperApplicationId])

  return (
    <div style={{ margin: '10vh 5vw' }}>
      {!isLoading && (!developerApplications || developerApplications?.length === 0) && (
        <Text c='dimmed' fw={500}>{`No developers are assigned to ${
          projectTeam?.customer ?? ''
        } project team.`}</Text>
      )}
      {developerApplications && (
        <Tabs
          orientation='vertical'
          placement='right'
          variant='pills'
          value={selectedDeveloperApplicationId}
          onChange={setSelectedDeveloperApplicationId}
        >
          <Tabs.List>
            {developerApplications?.map((developerApplication) => {
              return (
                <Tabs.Tab key={developerApplication.id} value={developerApplication.id}>
                  {`${developerApplication.student.firstName} ${developerApplication.student.lastName}`}
                </Tabs.Tab>
              )
            })}
          </Tabs.List>
          {developerApplications?.map((developerApplication) => {
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
