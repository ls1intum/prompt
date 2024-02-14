import { useState } from 'react'
import { StudentGradingForm } from './StudentGradingForm'
import { Tabs, Text } from '@mantine/core'
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

  const { data: developerApplications, isLoading } = useQuery({
    queryKey: [Query.DEVELOPER_APPLICATION, projectTeamId],
    queryFn: () => getDeveloperApplicationsByProjectTeam(projectTeamId),
  })

  return (
    <div style={{ margin: '10vh 5vw' }}>
      {!isLoading && (!developerApplications || developerApplications?.length === 0) && (
        <Text c='dimmed' fw={500}>{`No developers are assigned to ${
          projectTeam?.customer ?? ''
        } project team.`}</Text>
      )}
      {developerApplications && (
        <Tabs
          defaultValue={developerApplications.at(0)?.id}
          orientation='vertical'
          placement='left'
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
                <div style={{ margin: '0 2vw' }}>
                  <StudentGradingForm application={developerApplication} />
                </div>
              </Tabs.Panel>
            )
          })}
        </Tabs>
      )}
    </div>
  )
}
