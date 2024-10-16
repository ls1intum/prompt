import { notifications } from '@mantine/notifications'
import { DevelopmentProfile } from '../interface/application'
import { axiosInstance } from './configService'

export const getDevelopmentProfile = async (): Promise<DevelopmentProfile | undefined> => {
  try {
    return (await axiosInstance.get(`/api/students/development-profile`)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch development profile.`,
    })
    return undefined
  }
}
