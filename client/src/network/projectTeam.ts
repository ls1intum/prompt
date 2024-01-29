import { notifications } from '@mantine/notifications'
import { ProjectTeam } from '../redux/projectTeamsSlice/projectTeamsSlice'
import { Patch, axiosInstance } from '../service/configService'

export const getProjectTeams = async (courseIteration: string): Promise<ProjectTeam[]> => {
  try {
    return (await axiosInstance.get(`/api/project-teams?courseIteration=${courseIteration}`)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch project teams.`,
    })
    return []
  }
}

export const postProjectTeam = async (
  courseIteration: string,
  projectTeam: ProjectTeam,
): Promise<ProjectTeam | undefined> => {
  try {
    return (
      await axiosInstance.post(`/api/project-teams?courseIteration=${courseIteration}`, projectTeam)
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not create project team.`,
    })
    return undefined
  }
}

export const patchProjectTeam = async (
  projectTeamId: string,
  projectTeamPatch: Patch[],
): Promise<ProjectTeam | undefined> => {
  try {
    return (
      await axiosInstance.patch(`/api/project-teams/${projectTeamId}`, projectTeamPatch, {
        headers: {
          'Content-Type': 'application/json-path+json',
        },
      })
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not update project team.`,
    })
    return undefined
  }
}

export const deleteProjectTeam = async (projectTeamId: string): Promise<string | undefined> => {
  try {
    return (await axiosInstance.delete(`/api/project-teams/${projectTeamId}`)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not delete project team.`,
    })
    return undefined
  }
}
