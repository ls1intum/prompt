import { Button, Modal } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { type ProjectTeam } from '../../../../redux/projectTeamsSlice/projectTeamsSlice'
import { type AppDispatch } from '../../../../redux/store'
import { assignDeveloperApplicationToProjectTeam } from '../../../../redux/applicationsSlice/thunks/assignDeveloperApplicationToProjectTeam'
import { removeDeveloperApplicationFromProjectTeam } from '../../../../redux/applicationsSlice/thunks/removeDeveloperApplicationFromProjectTeam'
import {
  ApplicationStatus,
  type Application,
} from '../../../../redux/applicationsSlice/applicationsSlice'
import { TransferList, TransferListItem } from '../../../../utilities/TransferList/TransferList'
import { useApplicationStore } from '../../../../state/zustand/useApplicationStore'
import { useCourseIterationStore } from '../../../../state/zustand/useCourseIterationStore'

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
  const { selectedCourseIteration } = useCourseIterationStore()
  const developerApplications = useApplicationStore((state) =>
    state.developerApplications.filter(
      (application) =>
        application.assessment.status === String(ApplicationStatus.INTRO_COURSE_PASSED),
    ),
  )
  const [data, setData] = useState<TransferListItem[][]>([[], []])

  useEffect(() => {
    setData([
      developerApplications
        .filter((studentApplication: Application) => {
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
    <Modal title={projectTeam.customer} opened={opened} onClose={onClose} centered size='90%'>
      <TransferList
        leftSectionData={data[0]}
        rightSectionData={data[1]}
        leftSectionTitle='Student Applications'
        rightSectionTitle={projectTeam.customer}
        onChange={setData}
      />
      <Button variant='filled' onClick={save} style={{ marginTop: '2vh' }}>
        Save
      </Button>
    </Modal>
  )
}
