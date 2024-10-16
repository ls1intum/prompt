import { notifications } from '@mantine/notifications'
import axios from 'axios'
import { serverBaseUrl } from './configService'

export interface BambooProject {
  name: string
  key: string
}

export const createBambooProjects = async (
  bambooProjects: BambooProject[],
): Promise<BambooProject[] | undefined> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/infrastructure/bamboo/projects`,
      bambooProjects,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
      },
    )

    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Bamboo projects were successfully created!`,
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to create Bamboo projects. Server responded with: ${err as string}`,
    })

    return undefined
  }
}
