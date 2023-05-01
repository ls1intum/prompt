import { notifications } from '@mantine/notifications'
import axios from 'axios'
import { serverBaseUrl } from './configService'

export const BITBUCKET_PROJECT_PERMISSIONS = ['PROJECT_ADMIN', 'PROJECT_READ', 'PROJECT_WRITE']
export const BITBUCKET_PROJECT_REPOSITORY_PERMISSIONS = ['REPO_WRITE', 'REPO_ADMIN']

export interface BitbucketProject {
  key: string
}

export interface BitbucketRepository {
  id: string
  slug: string
  name: string
}

export interface BitbucketProjectPermissionGrant {
  projectKey: string
  permission: string
  groupNames: string[]
}

export interface BitbucketRepositoryPermissionGrant {
  projectKey: string
  repositorySlug: string
  permission: string
  users: string[]
  groupNames: string[]
}

export const fetchBitbucketProjects = async (
  query: string,
): Promise<BitbucketProject[] | undefined> => {
  try {
    const response = await axios.get(
      `${serverBaseUrl}/api/infrastructure/bitbucket/projects?query=${query}`,
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
      message: `Failed to fetch Bitbucket projects. Server responded with: ${err as string}`,
    })

    return undefined
  }
}

export const fetchBitbucketProjectRepositories = async (
  projectKey: string,
): Promise<BitbucketRepository[] | undefined> => {
  try {
    const response = await axios.get(
      `${serverBaseUrl}/api/infrastructure/bitbucket/projects/${projectKey}/repositories`,
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
      message: `Failed to fetch Bitbucket project repositories. Server responded with: ${
        err as string
      }`,
    })

    return undefined
  }
}

export const createBitbucketProjects = async (
  bitbucketProjectNames: string[],
  withRepository: boolean,
): Promise<BitbucketProject[] | undefined> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/infrastructure/bitbucket/projects?withRepository=${
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

export const createBitbucketProjectRepositories = async (
  projectKey: string,
  repositoryNames: string[],
): Promise<BitbucketRepository[] | undefined> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/infrastructure/bitbucket/projects/${projectKey}/repositories`,
      repositoryNames,
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
      message: `Bitbucket project repositories were successfully created!`,
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to create Bitbucket project repositories. Server responded with: ${
        err as string
      }`,
    })

    return undefined
  }
}

export const grantBitbucketProjectPermissions = async (
  bitbucketProjectPermissionGrants: BitbucketProjectPermissionGrant[],
): Promise<void> => {
  try {
    await axios.post(
      `${serverBaseUrl}/api/infrastructure/bitbucket/projects/permissions`,
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

export const grantBitbucketProjectRepositoryPermissions = async (
  bitbucketRepositoryPermissionGrants: BitbucketRepositoryPermissionGrant[],
): Promise<void> => {
  try {
    await axios.post(
      `${serverBaseUrl}/api/infrastructure/bitbucket/projects/repositories/permissions`,
      bitbucketRepositoryPermissionGrants,
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
      message: `Bitbucket project repository permissions were successfully granted!`,
    })
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to grant Bitbucket project repository permissions. Server responded with: ${
        err as string
      }`,
    })
  }
}
