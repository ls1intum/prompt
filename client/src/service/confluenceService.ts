import { notifications } from '@mantine/notifications'
import axios from 'axios'
import { serverBaseUrl } from './configService'

export interface ConfluenceSpace {
  name: string
  key: string
}

export const fetchConfluenceSpacesByKeys = async (
  spaceKeys: string[],
): Promise<ConfluenceSpace[] | undefined> => {
  try {
    const query = spaceKeys.map((spaceKey) => `spaceKey=${spaceKey}`).join('&')
    const response = await axios.get(
      `${serverBaseUrl}/api/infrastructure/confluence/spaces?${query}`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
      },
    )

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to fetch Confluence spaces. Server responded with: ${err as string}`,
    })

    return undefined
  }
}

export const createConfluenceSpaces = async (
  spaces: ConfluenceSpace[],
): Promise<ConfluenceSpace[] | undefined> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/infrastructure/confluence/spaces`,
      spaces,
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
      message: `Confluence spaces were successfully created!`,
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to create Confluence spaces. Server responded with: ${err as string}`,
    })

    return undefined
  }
}

export const assignConfluenceSpaceAdminPermissionToUserGroups = async ({
  spaceKey,
  userGroups,
}: {
  spaceKey: string
  userGroups: string[]
}): Promise<void> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/infrastructure/confluence/spaces/${spaceKey}/permissions`,
      userGroups,
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
      message: `Confluence space admin permission was successfully assigned to user groups!`,
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to assign Confluence space admin permission to user groups. Server responded with: ${
        err as string
      }`,
    })

    return undefined
  }
}
