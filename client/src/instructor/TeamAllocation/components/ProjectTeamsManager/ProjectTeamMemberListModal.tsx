import { Button, Modal, TransferList, type TransferListData } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { type ProjectTeam } from '../../../../redux/projectTeamsSlice/projectTeamsSlice'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import { assignDeveloperApplicationToProjectTeam } from '../../../../redux/applicationsSlice/thunks/assignDeveloperApplicationToProjectTeam'
import { fetchDeveloperApplications } from '../../../../redux/applicationsSlice/thunks/fetchApplications'
import { removeDeveloperApplicationFromProjectTeam } from '../../../../redux/applicationsSlice/thunks/removeDeveloperApplicationFromProjectTeam'

interface ProjectTeamMemberListModalProps {
  projectTeam: ProjectTeam
  opened: boolean
  onClose: () => void
}

export const ProjectTeamMemberListModal = ({
  projectTeam,
  opened,
  onClose,
}: ProjectTeamMemberListModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const developerApplications = useAppSelector((state) => state.applications.developerApplications)
  const [data, setData] = useState<TransferListData>([[], []])

  useEffect(() => {
    if (selectedCourseIteration) {
      void dispatch(
        fetchDeveloperApplications({
          courseIteration: selectedCourseIteration.semesterName,
          status: 'ENROLLED',
        }),
      )
    }
  }, [selectedCourseIteration])

  useEffect(() => {
    setData([
      developerApplications
        .filter((studentApplication) => {
          return studentApplication.projectTeam?.id !== projectTeam.id
        })
        .map((studentApplication) => {
          return {
            value: studentApplication.id,
            label: `${studentApplication.student.firstName ?? ''} ${
              studentApplication.student.lastName ?? ''
            } ${studentApplication.projectTeam ? `(${studentApplication.projectTeam.name})` : ''}`,
          }
        }),
      developerApplications
        .filter((studentApplication) => studentApplication.projectTeam?.id === projectTeam.id)
        .map((studentApplication) => {
          return {
            value: studentApplication.id,
            label: `${studentApplication.student.firstName ?? ''} ${
              studentApplication.student.lastName ?? ''
            } ${studentApplication.projectTeam ? `(${studentApplication.projectTeam.name})` : ''}`,
          }
        }),
    ])
  }, [projectTeam, developerApplications])

  const save = (): void => {
    const studentApplicationsPreviouslyInProjectTeam = developerApplications.filter(
      (studentApplication) => studentApplication.projectTeam?.id === projectTeam.id,
    )

    const studentApplicationsCurrentlyInProjectTeam = developerApplications.filter(
      (studentApplication) => data[1].map((entry) => entry.value).includes(studentApplication.id),
    )

    const studentApplicationsRemovedFromProjectTeam =
      studentApplicationsPreviouslyInProjectTeam.filter(
        (studentApplication) =>
          !studentApplicationsCurrentlyInProjectTeam.includes(studentApplication),
      )

    const studentApplicationsAddedToProjectTeam = studentApplicationsCurrentlyInProjectTeam.filter(
      (studentApplication) =>
        !studentApplicationsPreviouslyInProjectTeam.includes(studentApplication),
    )

    studentApplicationsAddedToProjectTeam.forEach((studentApplication) => {
      if (selectedCourseIteration) {
        void dispatch(
          assignDeveloperApplicationToProjectTeam({
            studentApplicationId: studentApplication.id,
            projectTeamId: projectTeam.id,
            courseIteration: selectedCourseIteration?.semesterName,
          }),
        )
      }
    })

    studentApplicationsRemovedFromProjectTeam.forEach((studentApplication) => {
      if (selectedCourseIteration) {
        void dispatch(
          removeDeveloperApplicationFromProjectTeam({
            applicationId: studentApplication.id,
            courseIteration: selectedCourseIteration.semesterName,
          }),
        )
      }
    })
  }

  return (
    <Modal opened={opened} onClose={onClose} centered size='xl'>
      <TransferList
        value={data}
        searchPlaceholder='Search...'
        nothingFound='Nothing here'
        titles={['Student Applications', 'Team Name']}
        onChange={setData}
        listHeight={600}
      />
      <Button variant='filled' onClick={save} style={{ marginTop: '2vh' }}>
        Save
      </Button>
    </Modal>
  )
}
