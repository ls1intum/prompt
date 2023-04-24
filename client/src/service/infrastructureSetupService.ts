import { notifications } from '@mantine/notifications'
import axios, { AxiosError } from 'axios'

export interface JiraProjectCategory {
  name: string
  description: string
}

export interface JiraUserGroup {
  name: string
}

export const createJiraProjectCategory = async (
  projectCategory: JiraProjectCategory,
): Promise<JiraProjectCategory | undefined> => {
  try {
    const response = await axios.post<JiraProjectCategory>(
      'http://localhost:8080/api/infrastructure/jira/project-categories',
      projectCategory,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
      },
    )

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      notifications.show({
        title: 'Error',
        message: `Failed to create a project category due to error: ${JSON.stringify(
          error.response?.data,
        )}`,
      })
    }
    return undefined
  }
}

export const AddUserToJiraGroup = async ({
  username,
  groupName,
}: {
  username: string
  groupName: string
}): Promise<JiraUserGroup | undefined> => {
  try {
    const response = await axios.post<JiraUserGroup>(
      `http://localhost:8080/api/infrastructure/jira/user/${username}/group/${groupName}`,
      {},
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
      },
    )

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      notifications.show({
        title: 'Error',
        message: `Failed to add user to user group due to error: ${JSON.stringify(
          error.response?.data,
        )}`,
      })
    }
    return undefined
  }
}

export const createJiraUserGroup = async (
  userGroup: JiraUserGroup,
): Promise<JiraUserGroup | undefined> => {
  try {
    const response = await axios.post<JiraUserGroup>(
      'http://localhost:8080/api/infrastructure/jira/user-groups',
      userGroup,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
      },
    )

    return response.data
  } catch (error) {
    if (error instanceof AxiosError) {
      notifications.show({
        title: 'Error',
        message: `Failed to create a user group due to error: ${JSON.stringify(
          error.response?.data,
        )}`,
      })
    }
    return undefined
  }
}
