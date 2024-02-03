import { notifications } from '@mantine/notifications'
import {
  IntroCourseAbsence,
  IntroCourseParticipation,
  Seat,
  SeatPlanAssignment,
  TechnicalDetails,
} from '../interface/introCourse'
import { Patch, axiosInstance } from '../service/configService'
import { Student } from '../interface/application'

export const getIntroCourseParticipations = async (
  courseIterationName: string,
): Promise<IntroCourseParticipation[]> => {
  try {
    return (await axiosInstance.get(`/api/intro-course?courseIteration=${courseIterationName}`))
      .data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch intro course participations.`,
    })
    return []
  }
}

export const patchIntroCourseParticipation = async (
  introCourseParticipationId: string,
  introCourseParticipationPatch: Patch[],
): Promise<IntroCourseParticipation | undefined> => {
  try {
    return (
      await axiosInstance.patch(
        `/api/intro-course/${introCourseParticipationId}`,
        introCourseParticipationPatch,
        {
          headers: {
            'Content-Type': 'application/json-path+json',
          },
        },
      )
    ).data
  } catch (err) {
    return undefined
  }
}

export const getIntroCourseTutors = async (courseIterationName: string): Promise<Student[]> => {
  try {
    return (
      await axiosInstance.get(`/api/intro-course/tutors?courseIteration=${courseIterationName}`)
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch tutors.`,
    })
    return []
  }
}

export const postIntroCourseAbsence = async (
  introCourseParticipationId: string,
  introCourseAbsence: IntroCourseAbsence,
): Promise<IntroCourseParticipation | undefined> => {
  try {
    const response = await axiosInstance.post(
      `/api/intro-course/${introCourseParticipationId}/absences`,
      introCourseAbsence,
    )

    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Intro course absence for student ${
        (response.data.student.firstName as string) ?? ''
      } ${(response.data.student.lastName as string) ?? ''} was successfully logged!`,
    })
    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to log an intro course absence.`,
    })

    return undefined
  }
}

export const deleteIntroCourseAbsence = async (
  introCourseParticipationId: string,
  introCourseAbsenceId: string,
): Promise<IntroCourseParticipation | undefined> => {
  try {
    return (
      await axiosInstance.delete(
        `/api/intro-course/${introCourseParticipationId}/absences/${introCourseAbsenceId}`,
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to delete an intro course absence.`,
    })
    return undefined
  }
}

export const postSeatPlan = async (
  courseIterationId: string,
  seatPlan: Seat[],
): Promise<IntroCourseParticipation[]> => {
  try {
    const response = await axiosInstance.post(
      `/api/intro-course/${courseIterationId}/seat-plan`,
      seatPlan,
    )
    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Seats have been successfully assigned to students!`,
    })
    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to create a seat plan. Server responded with ${err as string}`,
    })

    return []
  }
}

export const postSeatPlanAssignment = async (
  seatPlanAssignments: SeatPlanAssignment[],
): Promise<IntroCourseParticipation[]> => {
  try {
    return (
      await axiosInstance.post(`/api/intro-course/seat-plan-assignments`, seatPlanAssignments)
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to assign seats to students.`,
    })
    return []
  }
}

export const postIntroCourseDropOut = async (
  introCourseParticipationId: string,
): Promise<IntroCourseParticipation | undefined> => {
  try {
    const response = await axiosInstance.post(
      `/api/intro-course/${introCourseParticipationId}/dropped-out`,
      {},
    )

    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Status ${(response.data.student.firstName as string) ?? ''} ${
        (response.data.student.lastName as string) ?? ''
      } was successfully logged!`,
    })
    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to set a status.`,
    })

    return undefined
  }
}

export const deleteIntroCourseDropOut = async (
  introCourseParticipationId: string,
): Promise<IntroCourseParticipation | undefined> => {
  try {
    const response = await axiosInstance.delete(
      `/api/intro-course/${introCourseParticipationId}/dropped-out`,
    )

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to set a status.`,
    })

    return undefined
  }
}

export const postPassedIntroCourseParticipation = async (
  introCourseParticipationId: string,
): Promise<IntroCourseParticipation | undefined> => {
  try {
    const response = await axiosInstance.post(
      `/api/intro-course/${introCourseParticipationId}/passed`,
      {},
    )

    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Intro course challenge result ${
        (response.data.student.firstName as string) ?? ''
      } ${(response.data.student.lastName as string) ?? ''} was successfully logged!`,
    })
    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to set an intro course challenge result.`,
    })

    return undefined
  }
}

export const postNotPassedIntroCourseParticipation = async (
  introCourseParticipationId: string,
): Promise<IntroCourseParticipation | undefined> => {
  try {
    const response = await axiosInstance.post(
      `/api/intro-course/${introCourseParticipationId}/not-passed`,
      {},
    )

    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Intro course challenge result ${
        (response.data.student.firstName as string) ?? ''
      } ${(response.data.student.lastName as string) ?? ''} was successfully logged!`,
    })
    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to set an intro course challenge result.`,
    })

    return undefined
  }
}

export const postTechnicalDetails = async ({
  semesterName,
  studentId,
  technicalDetails,
}: {
  semesterName: string
  studentId: string
  technicalDetails: TechnicalDetails
}): Promise<IntroCourseParticipation | undefined> => {
  try {
    const response = await axiosInstance.post(
      `/api/intro-course/${semesterName}/technical-details/${studentId}`,
      technicalDetails,
    )
    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Your technical details were successfully submitted!`,
    })
    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to submit the form. Server responded with ${err as string}`,
    })

    return undefined
  }
}

export const postInvitationsToTechnicalDetailsSubmission = async (
  courseIterationId: string,
): Promise<void> => {
  try {
    await axiosInstance.post(
      `/api/intro-course/${courseIterationId}/technical-details-invitation`,
      {},
    )
    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Email invitations are successfully sent!`,
    })
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to submit the request. Server responded with ${err as string}`,
    })
  }
}
