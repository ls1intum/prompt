import axios, { type AxiosError } from 'axios'
import {
  type CoachApplication,
  type TutorApplication,
  type DeveloperApplication,
} from '../redux/applicationsSlice/applicationsSlice'
import { serverBaseUrl } from './configService'
import { notifications } from '@mantine/notifications'

export const createDeveloperApplication = async ({
  application,
  courseIteration,
}: {
  application: DeveloperApplication
  courseIteration: string
}): Promise<DeveloperApplication | undefined> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/applications/developer?courseIteration=${courseIteration}`,
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

export const createCoachApplication = async ({
  application,
  courseIteration,
}: {
  application: CoachApplication
  courseIteration: string
}): Promise<CoachApplication | undefined> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/applications/coach?courseIteration=${courseIteration}`,
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

export const createTutorApplication = async ({
  application,
  courseIteration,
}: {
  application: TutorApplication
  courseIteration: string
}): Promise<TutorApplication | undefined> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/applications/tutor?courseIteration=${courseIteration}`,
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
