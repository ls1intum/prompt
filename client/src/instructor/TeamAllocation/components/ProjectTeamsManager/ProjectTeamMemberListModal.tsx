import { Button, Modal, TransferList, type TransferListData } from '@mantine/core'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { type ProjectTeam } from '../../../../redux/projectTeamsSlice/projectTeamsSlice'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import { assignStudentApplicationToProjectTeam } from '../../../../redux/studentApplicationSlice/thunks/assignStudentApplicationToProjectTeam'
import { fetchStudentApplications } from '../../../../redux/studentApplicationSlice/thunks/fetchStudentApplications'
import { removeStudentApplicationFromProjectTeam } from '../../../../redux/studentApplicationSlice/thunks/removeStudentApplicationFromProjectTeam'

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
  const selectedApplicationSemester = useAppSelector(
    (state) => state.applicationSemester.currentState,
  )
  const studentApplications = useAppSelector(
    (state) => state.studentApplications.studentApplications,
  )
  const [data, setData] = useState<TransferListData>([[], []])

  useEffect(() => {
    if (selectedApplicationSemester) {
      void dispatch(
        fetchStudentApplications({
          applicationSemester: selectedApplicationSemester.semesterName,
          accepted: true,
        }),
      )
    }
  }, [selectedApplicationSemester])

  useEffect(() => {
    setData([
      studentApplications
        .filter((studentApplication) => {
          return studentApplication.projectTeam?.id !== projectTeam.id
        })
        .map((studentApplication) => {
          return {
            value: studentApplication.id,
            label: `${studentApplication.student.firstName} ${
              studentApplication.student.lastName
            } ${studentApplication.projectTeam ? `(${studentApplication.projectTeam.name})` : ''}`,
          }
        }),
      studentApplications
        .filter((studentApplication) => studentApplication.projectTeam?.id === projectTeam.id)
        .map((studentApplication) => {
          return {
            value: studentApplication.id,
            label: `${studentApplication.student.firstName} ${
              studentApplication.student.lastName
            } ${studentApplication.projectTeam ? `(${studentApplication.projectTeam.name})` : ''}`,
          }
        }),
    ])
  }, [projectTeam, studentApplications])

  const save = (): void => {
    const studentApplicationsPreviouslyInProjectTeam = studentApplications.filter(
      (studentApplication) => studentApplication.projectTeam?.id === projectTeam.id,
    )

    const studentApplicationsCurrentlyInProjectTeam = studentApplications.filter(
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
      if (selectedApplicationSemester) {
        void dispatch(
          assignStudentApplicationToProjectTeam({
            studentApplicationId: studentApplication.id,
            projectTeamId: projectTeam.id,
            applicationSemester: selectedApplicationSemester?.semesterName,
          }),
        )
      }
    })

    studentApplicationsRemovedFromProjectTeam.forEach((studentApplication) => {
      if (selectedApplicationSemester) {
        void dispatch(
          removeStudentApplicationFromProjectTeam({
            studentApplicationId: studentApplication.id,
            applicationSemester: selectedApplicationSemester.semesterName,
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
