import axios, { type AxiosError } from 'axios'
import { serverBaseUrl } from './configService'
import { notifications } from '@mantine/notifications'
import { type StudentPostKickoffSubmission } from '../redux/studentPostKickoffSubmissionsSlice/studentPostKickoffSubmissionsSlice'

export const createPostKickoffSubmission = async ({
  studentId,
  studentPostKickoffSubmission,
}: {
  studentId: string
  studentPostKickoffSubmission: StudentPostKickoffSubmission
}): Promise<StudentPostKickoffSubmission | undefined> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/post-kickoff-submissions/${studentId}`,
      studentPostKickoffSubmission,
    )
    if (response.status >= 200 && response.status < 300) {
      notifications.show({
        color: 'green',
        autoClose: 5000,
        title: 'Success',
        message: `Your project team preferences were successfully submitted!`,
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
