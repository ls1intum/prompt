import { notifications } from '@mantine/notifications'
import { axiosInstance } from './configService'
import { Skill } from '../interface/skill'

export const getSkills = async (): Promise<Skill[]> => {
  try {
    return (await axiosInstance.get(`/api/skills`)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch skills.`,
    })
    return []
  }
}

export const postSkill = async (skill: Skill): Promise<Skill | undefined> => {
  try {
    return (await axiosInstance.post(`/api/skills`, skill)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not create ${skill.title} skill.`,
    })
    return undefined
  }
}

export const toggleSkill = async (skillId: string): Promise<Skill | undefined> => {
  try {
    return (await axiosInstance.post(`/api/skills/${skillId}`, {})).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not toggle skill.`,
    })
    return undefined
  }
}

export const deleteSkill = async (skillId: string): Promise<string | undefined> => {
  try {
    return (await axiosInstance.delete(`/api/skills/${skillId}`)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not delete skill.`,
    })
    return undefined
  }
}
