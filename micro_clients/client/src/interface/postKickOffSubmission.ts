import { Student } from './application'
import { Skill } from './skill'

export enum SkillProficiency {
  NOVICE = 'Novice',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert',
}

export const getBadgeColor = (skillProfieciency: keyof typeof SkillProficiency): string => {
  switch (skillProfieciency) {
    case 'NOVICE':
      return 'yellow'
    case 'INTERMEDIATE':
      return 'orange'
    case 'ADVANCED':
      return 'teal'
    case 'EXPERT':
      return 'green'
  }
  return 'gray'
}

export enum SkillAssessmentSource {
  STUDENT = 'STUDENT',
  TUTOR = 'TUTOR',
  MGMT = 'MGMT',
}

export interface StudentSkill {
  id?: string
  skill: Skill
  skillAssessmentSource: SkillAssessmentSource
  skillProficiency: SkillProficiency
}

export interface StudentProjectTeamPreference {
  projectTeamId: string
  priorityScore: number
}

export interface StudentPostKickoffSubmission {
  id?: string
  student?: Student
  studentProjectTeamPreferences: StudentProjectTeamPreference[]
  reasonForFirstChoice: string
  reasonForLastChoice: string
  selfReportedExperienceLevel: SkillProficiency
  studentSkills: StudentSkill[]
}
