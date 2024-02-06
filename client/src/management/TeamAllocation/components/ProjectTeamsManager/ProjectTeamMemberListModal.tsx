import { Button, Modal } from '@mantine/core'
import { useEffect, useState } from 'react'
import { type Application, ApplicationType } from '../../../../interface/application'
import { TransferList, TransferListItem } from '../../../../utilities/TransferList/TransferList'
import { useCourseIterationStore } from '../../../../state/zustand/useCourseIterationStore'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  deleteApplicatioProjectTeamAssigment,
  postApplicationProjectTeamAssignment,
} from '../../../../network/application'
import { Query } from '../../../../state/query'
import { ProjectTeam } from '../../../../interface/projectTeam'

interface ProjectTeamMemberListModalProps {
  applications: Application[]
  projectTeam: ProjectTeam
  opened: boolean
  onClose: () => void
}

export const ProjectTeamMemberListModal = ({
  applications,
  projectTeam,
  opened,
  onClose,
}: ProjectTeamMemberListModalProps): JSX.Element => {
  const queryClient = useQueryClient()
  const { selectedCourseIteration } = useCourseIterationStore()
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
      applications
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
      applications
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
  }, [projectTeam, applications])

  const save = (): void => {
    const studentApplicationsPreviouslyInProjectTeam = applications.filter(
      (studentApplication) => studentApplication.projectTeam?.id === projectTeam.id,
    )

    const studentApplicationsCurrentlyInProjectTeam = applications.filter((studentApplication) =>
      data[1].map((entry) => entry.value).includes(studentApplication.id),
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
