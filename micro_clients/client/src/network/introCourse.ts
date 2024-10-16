import { notifications } from '@mantine/notifications'
import {
  IntroCourseAbsence,
  IntroCourseParticipation,
  Seat,
  SeatPlanAssignment,
} from '../interface/introCourse'
import { Patch, axiosInstance } from './configService'
import { DevelopmentProfile, Student } from '../interface/application'
import { AxiosError } from 'axios'

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
    if ((err as AxiosError)?.response?.status === 409) {
      notifications.show({
        color: 'red',
        autoClose: 10000,
        title: 'Error',
        message: `${((err as AxiosError)?.response?.data as string) ?? ''}`,
      })
    } else {
      notifications.show({
        color: 'red',
        autoClose: 10000,
        title: 'Error',
        message: `Failed to log an intro course absence.`,
      })
    }

    return undefined
  }
}

export const postIntroCourseAbsenceSelfReport = async (
  semesterName: string,
  tumId: string,
  introCourseAbsence: IntroCourseAbsence,
): Promise<IntroCourseParticipation | undefined> => {
  try {
    const response = await axiosInstance.post(
      `/api/intro-course/${semesterName}/students/${tumId}/absences`,
      introCourseAbsence,
    )

    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Intro course absence was successfully reported!`,
    })
    return response.data
  } catch (err) {
    if ((err as AxiosError)?.response?.status === 409) {
      notifications.show({
        color: 'red',
        autoClose: 10000,
        title: 'Error',
        message: `${((err as AxiosError)?.response?.data as string) ?? ''}`,
      })
    } else {
      notifications.show({
        color: 'red',
        autoClose: 10000,
        title: 'Error',
        message: `Failed to report an intro course absence.`,
      })
    }

    return undefined
  }
}

export const patchIntroCourseAbsence = async (
  introCourseAbsenceId: string,
  introCourseAbsencePatch: Patch[],
): Promise<IntroCourseAbsence | undefined> => {
  try {
    return (
      await axiosInstance.patch(
        `/api/intro-course/absences/${introCourseAbsenceId}`,
        introCourseAbsencePatch,
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

export const postIntroCourseAbsenceReportAcceptance = async (
  introCourseAbsenceId: string,
): Promise<IntroCourseAbsence | undefined> => {
  try {
    return (
      await axiosInstance.patch(`/api/intro-course/absences/${introCourseAbsenceId}/acceptance`, {})
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to accept an intro course absence.`,
    })
    return undefined
  }
}

export const postIntroCourseAbsenceReportRejection = async (
  introCourseAbsenceId: string,
): Promise<IntroCourseAbsence | undefined> => {
  try {
    return (
      await axiosInstance.patch(`/api/intro-course/absences/${introCourseAbsenceId}/rejection`, {})
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Failed to reject an intro course absence.`,
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

export const postDevelopmentProfile = async (
  developmentProfile: DevelopmentProfile,
): Promise<DevelopmentProfile | undefined> => {
  try {
    const response = await axiosInstance.post(
      `/api/students/development-profile`,
      developmentProfile,
    )
    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Your technical profile was successfully submitted!`,
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
