import { CoursePhase, CoursePhaseCheck } from './coursePhase'

export interface CourseIterationRequest {
  semesterName: string
  developerApplicationPeriodStart: Date
  developerApplicationPeriodEnd: Date
  coachApplicationPeriodStart: Date
  coachApplicationPeriodEnd: Date
  tutorApplicationPeriodStart: Date
  tutorApplicationPeriodEnd: Date
  coachInterviewDate: Date
  tutorInterviewDate: Date
  coachInterviewPlannerLink: string
  tutorInterviewPlannerLink: string
  coachInterviewLocation: string
  tutorInterviewLocation: string
  introCourseStart: Date
  introCourseEnd: Date
  kickoffSubmissionPeriodStart: Date
  kickoffSubmissionPeriodEnd: Date
  iosTag: string
}

export interface CourseIteration {
  id: string
  semesterName: string
  developerApplicationPeriodStart: Date
  developerApplicationPeriodEnd: Date
  coachApplicationPeriodStart: Date
  coachApplicationPeriodEnd: Date
  tutorApplicationPeriodStart: Date
  tutorApplicationPeriodEnd: Date
  coachInterviewDate: Date
  tutorInterviewDate: Date
  coachInterviewPlannerLink: string
  tutorInterviewPlannerLink: string
  coachInterviewLocation: string
  tutorInterviewLocation: string
  introCourseStart: Date
  introCourseEnd: Date
  kickoffSubmissionPeriodStart: Date
  kickoffSubmissionPeriodEnd: Date
  iosTag: string
  phases: CourseIterationPhase[]
}

export interface CourseIterationPhaseCheckEntry {
  id: string
  coursePhaseCheck: CoursePhaseCheck
  fulfilled: boolean
}

export interface CourseIterationPhase {
  id: string
  coursePhase: CoursePhase
  checkEntries: CourseIterationPhaseCheckEntry[]
  startDate: Date | null
  endDate: Date | null
}
