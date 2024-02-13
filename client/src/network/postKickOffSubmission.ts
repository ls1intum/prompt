import { notifications } from '@mantine/notifications'
import { StudentPostKickoffSubmission } from '../interface/postKickOffSubmission'
import { axiosInstance } from './configService'

export const getPostKickOffSubmissions = async (
  courseIteration: string,
): Promise<StudentPostKickoffSubmission[]> => {
  try {
    return (
      await axiosInstance.get(`/api/post-kickoff-submissions?courseIteration=${courseIteration}`)
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch post kick off submissions.`,
    })
    return []
  }
}

export const postPostKickoffSubmission = async (
  studentId: string,
  studentPostKickoffSubmission: StudentPostKickoffSubmission,
): Promise<StudentPostKickoffSubmission | undefined> => {
  try {
    const response = await axiosInstance.post(
      `/api/post-kickoff-submissions/${studentId}`,
      studentPostKickoffSubmission,
    )
    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Your project team preferences were successfully submitted!`,
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

export const deleteProjectTeamPreferences = async (
  courseIteration: string,
): Promise<StudentPostKickoffSubmission[]> => {
  try {
    return (
      await axiosInstance.delete(
        `/api/post-kickoff-submissions/project-team-preferences?courseIteration=${courseIteration}`,
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not delete project team preferences.`,
    })
    return []
  }
}

export const postInvitationsToPostKickOffSubmissions = async (
  courseIteration: string,
): Promise<void> => {
  try {
    return (
      await axiosInstance.post(
        `/api/post-kickoff-submissions/invitations?courseIteration=${courseIteration}`,
        {},
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not send invitations to post kick off submissions.`,
    })
  }
}
