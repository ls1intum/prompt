import { Button, Modal } from '@mantine/core'
import { useEffect, useState } from 'react'
import { type ProjectTeam } from '../../../../redux/projectTeamsSlice/projectTeamsSlice'
import {
  ApplicationStatus,
  type Application,
  ApplicationType,
} from '../../../../interface/application'
import { TransferList, TransferListItem } from '../../../../utilities/TransferList/TransferList'
import { useApplicationStore } from '../../../../state/zustand/useApplicationStore'
import { useCourseIterationStore } from '../../../../state/zustand/useCourseIterationStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  deleteApplicatioProjectTeamAssigment,
  postApplicationProjectTeamAssignment,
} from '../../../../network/application'
import { Query } from '../../../../state/query'

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
  const queryClient = useQueryClient()
  const { selectedCourseIteration } = useCourseIterationStore()
  const developerApplications = useApplicationStore((state) =>
    state.developerApplications.filter(
      (application) =>
        application.assessment.status === String(ApplicationStatus.INTRO_COURSE_PASSED),
    ),
  )
  const [data, setData] = useState<TransferListItem[][]>([[], []])

  const assignApplicationToProjectTeam = useMutation({
    mutationFn: (applicationId: string) =>
      postApplicationProjectTeamAssignment(
        ApplicationType.DEVELOPER,
        applicationId,
        projectTeam.id,
        selectedCourseIteration?.semesterName ?? '',
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.DEVELOPER_APPLICATION] })
    },
  })

  const removeApplicationFromProjectTeam = useMutation({
    mutationFn: (applicationId: string) =>
      deleteApplicatioProjectTeamAssigment(
        ApplicationType.DEVELOPER,
        applicationId,
        selectedCourseIteration?.semesterName ?? '',
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.DEVELOPER_APPLICATION] })
    },
  })

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
        assignApplicationToProjectTeam.mutate(studentApplication.id)
      }
    })

    studentApplicationsRemovedFromProjectTeam.forEach((studentApplication) => {
      if (selectedCourseIteration) {
        removeApplicationFromProjectTeam.mutate(studentApplication.id)
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
