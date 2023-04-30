import { notifications } from '@mantine/notifications'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_SERVER_URL ?? ''

export interface ConfluenceSpace {
  name: string
  key: string
}

export const createConfluenceSpaces = async (
  confluenceSpaceNames: string[],
): Promise<ConfluenceSpace[] | undefined> => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/infrastructure/confluence/spaces`,
      confluenceSpaceNames,
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
