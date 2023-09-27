import axios, { type AxiosError } from 'axios'
import { serverBaseUrl } from './configService'
import { notifications } from '@mantine/notifications'
import {
  type IntroCourseParticipation,
  type TechnicalDetails,
} from '../redux/introCourseSlice/introCourseSlice'

export const submitStudentTechnicalDetails = async ({
  semesterName,
  studentId,
  technicalDetails,
}: {
  semesterName: string
  studentId: string
  technicalDetails: TechnicalDetails
}): Promise<IntroCourseParticipation | undefined> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/intro-course/${semesterName}/technical-details/${studentId}`,
      technicalDetails,
    )
    if (response.status >= 200 && response.status < 300) {
      notifications.show({
        color: 'green',
        autoClose: 5000,
        title: 'Success',
        message: `Your technical details were successfully submitted!`,
      })
    }
    return response.data
  } catch (err) {
    if ((err as AxiosError)?.response?.status === 400) {
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
        message: `Failed to submit the form. Server responded with ${err as string}`,
      })
    }

    return undefined
  }
}

export const sendInvitationsForStudentTechnicalDetailsSubmission = async (
  courseIterationId: string,
): Promise<void> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/intro-course/${courseIterationId}/technical-details-invitation`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
      },
    )
    if (response.status >= 200 && response.status < 300) {
      notifications.show({
        color: 'green',
        autoClose: 5000,
        title: 'Success',
        message: `Email invitations are successfully sent!`,
      })
    }
  } catch (err) {
    if ((err as AxiosError)?.response?.status === 400) {
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
        message: `Failed to submit the request. Server responded with ${err as string}`,
      })
    }
  }
}
