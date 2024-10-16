import { ProjectTeam } from './projectTeam'

export enum ApplicationType {
  DEVELOPER = 'developer',
  COACH = 'coach',
  TUTOR = 'tutor',
}

export enum LanguageProficiency {
  A1A2 = 'A1/A2',
  B1B2 = 'B1/B2',
  C1C2 = 'C1/C2',
  NATIVE = 'Native',
}

export enum StudyDegree {
  BACHELOR = 'Bachelor',
  MASTER = 'Master',
}

export enum StudyProgram {
  COMPUTER_SCIENCE = 'Computer Science',
  INFORMATION_SYSTEMS = 'Information Systems',
  GAMES_ENGINEERING = 'Games Engineering',
  MANAGEMENT_AND_TECHNOLOGY = 'Management and Technology',
  OTHER = 'Other',
}

export enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
  PREFER_NOT_TO_SAY = 'Prefer not to say',
}

export enum Device {
  MACBOOK = 'Mac',
  IPHONE = 'IPhone',
  IPAD = 'IPad',
  APPLE_WATCH = 'Watch',
  VISION_PRO = 'Vision Pro',
  RASPBERRY_PI = 'Raspberry PI',
}

export enum Course {
  ITSE = 'Introduction to Software Engineering (IN0006)',
  PSE = 'Patterns in Software Engineering (IN2081)',
  ITP = 'Introduction to Programming (CIT5230000)',
  IPRAKTIKUM = 'iPraktikum (IN0012, IN2106, IN2128)',
  JASS = 'Joint Advanced Student School',
  FK = 'Ferienakademie',
  THESIS = 'Thesis',
}

export interface Student {
  id: string
  tumId?: string
  matriculationNumber?: string
  isExchangeStudent: boolean
  firstName?: string
  lastName?: string
  gender?: keyof typeof Gender
  nationality?: string
  email?: string
  suggestedAsCoach: boolean
  suggestedAsTutor: boolean
  blockedByPm: boolean
  reasonForBlockedByPm: string
  developmentProfile?: DevelopmentProfile
}

export interface DevelopmentProfile {
  id: string
  gitlabUsername: string
  appleId: string
  macBookDeviceId?: string
  iPhoneDeviceId?: string
  iPadDeviceId?: string
  appleWatchDeviceId?: string
}

export enum ApplicationStatus {
  NOT_ASSESSED = 'Not assessed',
  PENDING_INTERVIEW = 'Pending interview',
  ACCEPTED = 'Accepted',
  REJECTED = 'Rejected',
  ENROLLED = 'Enrolled',
  DROPPED_OUT = 'Dropped out',
  INTRO_COURSE_PASSED = 'Intro course passed',
  INTRO_COURSE_NOT_PASSED = 'Intro course not passed',
}

export interface ApplicationAssessment {
  instructorComments: InstructorComment[]
  assessmentScore: number
  technicalChallengeProgrammingScore: number
  technicalChallengeQuizScore: number
  status: keyof typeof ApplicationStatus
}

export interface Grade {
  id: string
  grade: number
  comment: string
}

export interface Application {
  id: string
  // The following field is artificially filled out by the client
  type: ApplicationType
  student: Student
  studyDegree?: StudyDegree
  currentSemester?: string
  studyProgram?: StudyProgram
  englishLanguageProficiency?: LanguageProficiency
  germanLanguageProficiency?: LanguageProficiency
  motivation?: string
  experience?: string
  solvedProblem?: string
  reasonGoodTutor?: string
  devices: Device[]
  coursesTaken: Course[]
  assessment: ApplicationAssessment
  projectTeam?: ProjectTeam
  finalGrade?: Grade
}

export interface InstructorComment {
  id?: string
  author: string
  timestamp?: string
  text: string
}
