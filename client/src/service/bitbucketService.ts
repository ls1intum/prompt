import { notifications } from '@mantine/notifications'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_SERVER_URL ?? ''

export const BITBUCKET_PROJECT_PERMISSIONS = ['PROJECT_ADMIN', 'PROJECT_READ', 'PROJECT_WRITE']

export interface BitbucketProject {
  key: string
}

export interface BitbucketProjectPermissionGrant {
  projectKey: string
  permission: string
  groupNames: string[]
}

export const createBitbucketProjects = async (
  bitbucketProjectNames: string[],
  withRepository: boolean,
): Promise<BitbucketProject[] | undefined> => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/infrastructure/bitbucket/projects?withRepository=${
        withRepository ? 'true' : 'false'
      }`,
      bitbucketProjectNames,
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
      message: `Bitbucket projects were successfully created!`,
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to create Bitbucket projects. Server responded with: ${err as string}`,
    })

    return undefined
  }
}

export const grantBitbucketProjectPermissions = async (
  bitbucketProjectPermissionGrants: BitbucketProjectPermissionGrant[],
): Promise<void> => {
  try {
    await axios.post(
      `${baseUrl}/api/infrastructure/bitbucket/projects/permissions`,
      bitbucketProjectPermissionGrants,
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
      message: `Bitbucket project permissions were successfully granted!`,
    })
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to grant Bitbucket project permissions. Server responded with: ${
        err as string
      }`,
    })
  }
}
