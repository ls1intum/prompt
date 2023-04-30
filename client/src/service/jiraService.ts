import { notifications } from '@mantine/notifications'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_SERVER_URL ?? ''

export const JIRA_PROJECT_CATEGORIES_MGMT = ['', 'CW', 'COACHPL']
export const JIRA_PROJECTS_MGMT = ['CW', 'COACHPL']
export const JIRA_USER_GROUPS_MGMT = ['', 'pm', 'pl', 'coaches', 'tutors']
export const JIRA_PROJECT_ROLES = ['administrators', 'users', 'developers']

export const JIRA_USER_GROUPS_TEAMS = ['', '-mgmt', '-customers']

export interface JiraGroup {
  name: string
}

export interface JiraProjectCategory {
  id?: string
  name: string
}

export interface JiraProjectRole {
  id: string
  name: string
}

export interface JiraProject {
  name: string
  key: string
  lead: string
  categoryId?: string
}

export interface JiraProjectRoleActor {
  projectKey: string
  roleId: string
  groupNames: string[]
}

export const createJiraGroups = async (
  jiraGroupNames: string[],
): Promise<JiraGroup[] | undefined> => {
  try {
    const response = await axios.post(`${baseUrl}/api/infrastructure/jira/groups`, jiraGroupNames, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
      },
    })

    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Jira groups were successfully created!`,
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to create Jira groups. Server responded with: ${err as string}`,
    })

    return undefined
  }
}

export const createJiraProjectCategories = async (
  jiraProjectCategoryNames: string[],
): Promise<JiraProjectCategory[] | undefined> => {
  try {
    const response = await axios.post(
      `${baseUrl}/api/infrastructure/jira/project-categories`,
      jiraProjectCategoryNames,
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
      message: `Jira project categories were successfully created!`,
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to create Jira project categories. Server responded with: ${err as string}`,
    })

    return undefined
  }
}

export const createJiraProjects = async (
  jiraProjects: JiraProject[],
): Promise<JiraProject[] | undefined> => {
  try {
    const response = await axios.post(`${baseUrl}/api/infrastructure/jira/projects`, jiraProjects, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
      },
    })

    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Jira projects were successfully created!`,
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to create Jira projects. Server responded with: ${err as string}`,
    })

    return undefined
  }
}

export const addUsersToJiraGroup = async (
  groupName: string,
  usernames: string[],
): Promise<void> => {
  try {
    await axios.post(`${baseUrl}/api/infrastructure/jira/groups/${groupName}/users`, usernames, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
      },
    })

    notifications.show({
      color: 'green',
      autoClose: 5000,
      title: 'Success',
      message: `Users are successfully added to the Jira group!`,
    })
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to add users to the Jira group. Server responded with: ${err as string}`,
    })
  }
}

export const addJiraProjectRoleActors = async (
  jiraProjectRoleActors: JiraProjectRoleActor[],
): Promise<void> => {
  try {
    await axios.post(
      `${baseUrl}/api/infrastructure/jira/projects/roles/actors`,
      jiraProjectRoleActors,
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
      message: `Jira actors were successfully added to the project roles!`,
    })
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to add Jira actors to project roles. Server responded with: ${
        err as string
      }`,
    })
  }
}

export const fetchJiraProjectRoles = async (): Promise<JiraProjectRole[] | undefined> => {
  try {
    const response = await axios.get(`${baseUrl}/api/infrastructure/jira/roles`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
      },
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to fetch Jira project roles. Server responded with: ${err as string}`,
    })

    return undefined
  }
}

export const fetchJiraGroups = async (query: string): Promise<JiraGroup[] | undefined> => {
  try {
    const response = await axios.get(`${baseUrl}/api/infrastructure/jira/groups?query=${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
      },
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to fetch Jira groups. Server responded with: ${err as string}`,
    })

    return undefined
  }
}

export const fetchJiraProjects = async (query: string): Promise<JiraProject[] | undefined> => {
  try {
    const response = await axios.get(`${baseUrl}/api/infrastructure/jira/projects?query=${query}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
      },
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to fetch Jira projects. Server responded with: ${err as string}`,
    })

    return undefined
  }
}

export const fetchJiraProjectCategories = async (): Promise<JiraProjectCategory[] | undefined> => {
  try {
    const response = await axios.get(`${baseUrl}/api/infrastructure/jira/project-categories`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
      },
    })

    return response.data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 5000,
      title: 'Error',
      message: `Failed to fetch Jira project categories. Server responded with: ${err as string}`,
    })

    return undefined
  }
}
