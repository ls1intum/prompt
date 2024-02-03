import { SkillProficiency } from '../redux/studentPostKickoffSubmissionsSlice/studentPostKickoffSubmissionsSlice'
import { Student } from './application'

export interface IntroCourseAbsence {
  id: string
  date: Date
  excuse: string
}

export interface TechnicalDetails {
  studentId?: string
  appleId: string
  macBookDeviceId?: string
  iPhoneDeviceId?: string
  iPadDeviceId?: string
  appleWatchDeviceId?: string
}

export interface IntroCourseParticipation {
  id: string
  tutorId?: string
  student: Student
  appleId?: string
  macBookDeviceId?: string
  iphoneDeviceId?: string
  ipadDeviceId?: string
  appleWatchDeviceId?: string
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
