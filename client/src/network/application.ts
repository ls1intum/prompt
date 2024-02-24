import { notifications } from '@mantine/notifications'
import {
  Student,
  type ApplicationType,
  InstructorComment,
  Application,
  ApplicationStatus,
  Grade,
} from '../interface/application'
import { Patch, axiosInstance } from './configService'
import { AxiosError } from 'axios'

export const getApplications = async (
  applicationType: ApplicationType,
  courseIteration: string,
  status?: keyof typeof ApplicationStatus,
): Promise<Application[]> => {
  try {
    return (
      await axiosInstance.get(
        `/api/applications/${applicationType}?courseIteration=${courseIteration}${
          status ? `&applicationStatus=${status.toString()}` : ''
        }`,
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch ${applicationType} applications.`,
    })
    return []
  }
}

export const getDeveloperApplicationsByProjectTeam = async (
  projectTeamId: string,
): Promise<Application[]> => {
  try {
    return (
      await axiosInstance.get(`/api/project-teams/${projectTeamId}/developers`, {
        headers: {
          'Content-Type': 'application/json-path+json',
        },
      })
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch developer application for the project team.`,
    })
    return []
  }
}

export const postDeveloperApplicationGrade = async (
  applicationId: string,
  grade: Partial<Grade>,
): Promise<Application | undefined> => {
  try {
    const response = await axiosInstance.post(
      `/api/applications/developer/${applicationId}/grading`,
      grade,
      {
        headers: {
          'Content-Type': 'application/json-path+json',
        },
      },
    )
    notifications.show({
      color: 'green',
      autoClose: 10000,
      title: 'Success',
      message: `Grade has been assigned successfully.`,
    })
    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not assign a grade.`,
    })
    return undefined
  }
}

export const postApplication = async (
  applicationType: ApplicationType,
  application: Partial<Application>,
  courseIteration: string,
): Promise<Application | undefined> => {
  try {
    const response = await axiosInstance.post(
      `/api/applications/${applicationType}?courseIteration=${courseIteration}`,
      application,
    )
    if (response.status >= 200 && response.status < 300) {
      notifications.show({
        color: 'green',
        autoClose: 5000,
        title: 'Success',
        message: `Your application was successfully submitted!`,
      })
    }
    return response.data
  } catch (err) {
    if ((err as AxiosError)?.response?.status === 409) {
      notifications.show({
        color: 'red',
        autoClose: 10000,
        title: 'Error',
        message: `An application for this student already exists. If you haven't submitted it, please contact the program management.`,
      })
    } else if ((err as AxiosError)?.response?.status === 400) {
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
        message: `Failed to submit the application. Server responded with ${err as string}`,
      })
    }

    return undefined
  }
}

export const deleteApplication = async (
  applicationType: ApplicationType,
  applicationId: string,
): Promise<string | undefined> => {
  try {
    return (await axiosInstance.delete(`/api/applications/${applicationType}/${applicationId}`))
      .data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not delete application.`,
    })
    return undefined
  }
}

export const patchDeveloperApplication = async (
  applicationId: string,
  applicationPatch: Patch[],
): Promise<Application | undefined> => {
  try {
    return (
      await axiosInstance.patch(`/api/applications/developer/${applicationId}`, applicationPatch, {
        headers: {
          'Content-Type': 'application/json-path+json',
        },
      })
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not update developer application.`,
    })
    return undefined
  }
}

export const patchApplicationAssessment = async (
  applicationType: ApplicationType,
  applicationId: string,
  assessmentPatch: Patch[],
): Promise<Application | undefined> => {
  try {
    return (
      await axiosInstance.patch(
        `/api/applications/${applicationType}/${applicationId}/assessment`,
        assessmentPatch,
        {
          headers: {
            'Content-Type': 'application/json-path+json',
          },
        },
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not assess application.`,
    })
    return undefined
  }
}

export const patchStudentAssessment = async (
  studentId: string,
  studentAssessmentPatch: Patch[],
): Promise<Student | undefined> => {
  try {
    return (
      await axiosInstance.patch(
        `/api/applications/students/${studentId}/assessment`,
        studentAssessmentPatch,
        {
          headers: {
            'Content-Type': 'application/json-path+json',
          },
        },
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not assess student.`,
    })
    return undefined
  }
}

export const postInstructorComment = async (
  applicationType: ApplicationType,
  applicationId: string,
  instructorComment: InstructorComment,
): Promise<Application | undefined> => {
  try {
    return (
      await axiosInstance.post(
        `/api/applications/${applicationType}/${applicationId}/instructor-comments`,
        instructorComment,
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to create an instructor comment. Server responded with ${err as string}`,
    })
    return undefined
  }
}

export const postApplicationAcceptance = async (
  applicationType: ApplicationType,
  applicationId: string,
): Promise<Application | undefined> => {
  try {
    return (
      await axiosInstance.post(
        `/api/applications/${applicationType}/${applicationId}/acceptance`,
        {},
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to send an application acceptance.`,
    })

    return undefined
  }
}

export const postApplicationRejection = async (
  applicationType: ApplicationType,
  applicationId: string,
): Promise<Application | undefined> => {
  try {
    return (
      await axiosInstance.post(
        `/api/applications/${applicationType}/${applicationId}/rejection`,
        {},
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to send an application rejection.`,
    })
    return undefined
  }
}

export const postApplicationEnrollment = async (
  applicationType: ApplicationType,
  applicationIds: string[],
): Promise<Application[]> => {
  try {
    return (
      await axiosInstance.post(`/api/applications/${applicationType}/enrollment`, applicationIds)
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to enroll applications.`,
    })
    return []
  }
}

export const postApplicationProjectTeamAssignment = async (
  applicationType: ApplicationType,
  applicationId: string,
  projectTeamId: string,
  courseIteration: string,
): Promise<Application | undefined> => {
  try {
    return (
      await axiosInstance.post(
        `/api/applications/${applicationType}/${applicationId}/project-team/${projectTeamId}?courseIteration=${courseIteration}`,
        {},
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to assign application to project team.`,
    })
    return undefined
  }
}

export const deleteApplicatioProjectTeamAssigment = async (
  applicatioType: ApplicationType,
  applicationId: string,
): Promise<Application | undefined> => {
  try {
    return (
      await axiosInstance.delete(
        `/api/applications/${applicatioType}/${applicationId}/project-team`,
      )
    ).data
  } catch (err) {
    return undefined
  }
}

export const postInterviewInvitation = async (
  applicationType: ApplicationType,
  applicationId: string,
): Promise<Application | undefined> => {
  try {
    return (
      await axiosInstance.post(
        `/api/applications/${applicationType}/${applicationId}/interview-invitations`,
        {},
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to send an interview invitation.`,
    })
    return undefined
  }
}

export const postTechnicalScores = async (
  programmingScoreThreshold: number,
  quizScoreThreshold: number,
  scores: Array<{
    developerApplicationId: string
    programmingScore: number
    quizScore: number
  }>,
): Promise<Application[]> => {
  try {
    return (
      await axiosInstance.post(
        `/api/applications/developer/technical-challenge-scores?programmingScoreThreshold=${programmingScoreThreshold}&quizScoreThreshold=${quizScoreThreshold}`,
        scores,
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to assign technical scores to applications.`,
    })
    return []
  }
}
