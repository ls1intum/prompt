import { Alert, Button, Group, Stack, Tabs } from '@mantine/core'
import { IconAlertCircle, IconDownload, IconUsersGroup } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
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
import { CSVLink } from 'react-csv'
import { Application } from '../../interface/application'

interface ExportGrade {
  projectTeam: string
  tumId: string
  matriculationNumber: string
  firstName: string
  lastName: string
  grade: number
  comment: string
}

export const GradingManagementConsole = (): JSX.Element => {
  const { user, permissions } = useAuthenticationStore()
  const { projectTeams, setProjectTeams } = useProjectTeamStore()
  const { selectedCourseIteration } = useCourseIterationStore()
  const [activeProjectTeam, setActiveProjectTeam] = useState<string | null>()
  const downloadLinkRef = useRef<HTMLAnchorElement & { link: HTMLAnchorElement }>(null)
  const [exportGrades, setExportGrades] = useState<ExportGrade[]>([])

  const { data: fetchedProjectTeams } = useQuery<ProjectTeam[]>({
    queryKey: [Query.PROJECT_TEAM, selectedCourseIteration?.semesterName],
    queryFn: () => getProjectTeams(selectedCourseIteration?.semesterName ?? ''),
    enabled: !!selectedCourseIteration,
  })

  const updateExportGrades = (projectTeam: string, developerApplications: Application[]): void => {
    setExportGrades((current) => {
      return [
        ...current.filter((grade) => grade.projectTeam !== projectTeam),
        ...developerApplications.map((application) => {
          return {
            projectTeam: projectTeam,
            tumId: application.student.tumId ?? '',
            matriculationNumber: application.student.matriculationNumber ?? '',
            firstName: application.student.firstName ?? '',
            lastName: application.student.lastName ?? '',
            grade: application.finalGrade?.grade ?? 0,
            comment: application.finalGrade?.comment ?? '',
          }
        }),
      ]
    })
  }

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
        <Stack>
          <Group grow>
            <Button
              leftSection={<IconDownload />}
              onClick={() => {
                downloadLinkRef.current?.link?.click()
              }}
            >
              Export
            </Button>
          </Group>
          <CSVLink
            data={exportGrades}
            filename='grades.csv'
            style={{ display: 'hidden' }}
            ref={downloadLinkRef}
            target='_blank'
          />
          <Tabs
            defaultValue={projectTeams.at(0)?.id}
            value={activeProjectTeam}
            onChange={setActiveProjectTeam}
          >
            <Tabs.List grow>
              {projectTeams.map((projectTeam) => {
                return (
                  <Tabs.Tab
                    key={projectTeam.id}
                    value={projectTeam.id}
                    leftSection={<IconUsersGroup />}
                  >
                    {projectTeam.customer}
                  </Tabs.Tab>
                )
              })}
            </Tabs.List>
            {projectTeams.map((projectTeam) => {
              return (
                <Tabs.Panel value={projectTeam.id} key={projectTeam.id}>
                  <ProjectTeamGrading
                    projectTeamId={projectTeam.id}
                    setExportGrades={updateExportGrades}
                  />
                </Tabs.Panel>
              )
            })}
          </Tabs>
        </Stack>
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
