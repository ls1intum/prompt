import { notifications } from '@mantine/notifications'
import {
  type Application,
  type ApplicationStatus,
} from '../redux/applicationsSlice/applicationsSlice'
import { axiosInstance } from '../service/configService'

export const getApplications = async (
  applicationType: string,
  courseIteration: string,
  status?: keyof typeof ApplicationStatus,
): Promise<Application[]> => {
  try {
    return (
      await axiosInstance.get(
        `/api/applications/${applicationType}?courseIteration=${courseIteration}${
          status ? `&applicationStatus=${status}` : ''
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
