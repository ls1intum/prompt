export interface CoursePhase {
  id: string
  name: string
  sequentialOrder: number
  type: CoursePhaseType
  checks: CoursePhaseCheck[]
}

export interface CoursePhaseCheck {
  id: string
  title: string
  description: string
  sequentialOrder: number
}

export enum CoursePhaseType {
  PRE_APPLICATION = 'PRE_APPLICATION',
  APPLICATION = 'APPLICATION',
  STUDENT_PRE_SELECTION = 'STUDENT_PRE_SELECTION',
  STUDENT_ADMISSION = 'STUDENT_ADMISSION',
  INTRO_COURSE_PLANNING = 'INTRO_COURSE_PLANNING',
  INTRO_COURSE_ASSESSMENT = 'INTRO_COURSE_ASSESSMENT',
  PROJECT_PREFERENCES_COLLECTION = 'PROJECT_PREFERENCES_COLLECTION',
  TEAM_ALLOCATION = 'TEAM_ALLOCATION',
  PROJECT_INFRASTRUCTURE_SETUP = 'PROJECT_INFRASTRUCTURE_SETUP',
  INTERMEDIATE_GRADING = 'INTERMEDIATE_GRADING',
  FINAL_DELIVERY = 'FINAL_DELIVERY',
  FINAL_GRADING = 'FINAL_GRADING',
  OTHER = 'OTHER',
}

export interface CoursePhasesSliceState {
  status: string
  error: string | null
  coursePhases: CoursePhase[]
}
