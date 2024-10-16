import { Student } from './application'
import { SkillProficiency } from './postKickOffSubmission'

export enum IntroCourseAbsenceReportStatus {
  PENDING = 'Pending',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
}

export interface IntroCourseAbsence {
  id: string
  date: Date
  excuse: string
  selfReported: boolean
  status: keyof typeof IntroCourseAbsenceReportStatus
}

export interface IntroCourseParticipation {
  id: string
  tutorId?: string
  student: Student
  seat?: string
  chairDevice?: string
  absences: IntroCourseAbsence[]
  supervisorAssessment?: keyof typeof SkillProficiency
  selfAssessment?: keyof typeof SkillProficiency
  studentComments?: string
  tutorComments?: string
  passed?: boolean
  droppedOut?: boolean
}

export interface SeatPlanAssignment {
  introCourseParticipationId: string
  seat: string
  tutorId?: string
}

export interface Seat {
  seat: string
  tutorId?: string
  chairDevice: string
}

export interface IntroCourseSliceState {
  status: string
  error: string | null
  participations: IntroCourseParticipation[]
  tutors: Student[]
}
