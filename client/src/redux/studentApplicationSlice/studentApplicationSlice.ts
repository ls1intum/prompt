import { createSlice } from '@reduxjs/toolkit'
import { type ProjectTeam } from '../projectTeamsSlice/projectTeamsSlice'
import { assignStudentApplicationToProjectTeam } from './thunks/assignStudentApplicationToProjectTeam'
import { createStudentApplication } from './thunks/createStudentApplication'
import { createInstructorComment } from './thunks/createInstructorComment'
import { fetchStudentApplications } from './thunks/fetchStudentApplications'
import { removeStudentApplicationFromProjectTeam } from './thunks/removeStudentApplicationFromProjectTeam'
import { updateStudentApplication } from './thunks/updateStudentApplication'

enum LanguageProficiency {
  A1A2 = 'A1/A2',
  B1B2 = 'B1/B2',
  C1C2 = 'C1/C2',
  NATIVE = 'Native',
}

enum StudyDegree {
  BACHELOR = 'Bachelor',
  MASTER = 'Master',
}

enum StudyProgram {
  COMPUTER_SCIENCE = 'Computer Science',
  INFORMATION_SYSTEMS = 'Information Systems',
  GAMES_ENGINEERING = 'Games Engineering',
  MANAGEMENT_AND_TECHNOLOGY = 'Management and Technology',
}

enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
  PREFER_NOT_TO_SAY = 'Prefer not to say',
}

enum Device {
  MACBOOK = 'Mac',
  IPHONE = 'IPhone',
  IPAD = 'IPad',
  APPLE_WATCH = 'Watch',
  RASPBERRY_PI = 'Raspberry PI',
}

interface Student {
  id: string
  tumId: string
  matriculationNumber: string
  isExchangeStudent: boolean
  firstName: string
  lastName: string
  gender: Gender
  nationality: string
  email: string
}

interface StudentApplicationAssessment {
  instructorComments: InstructorComment[]
  suggestedAsCoach: boolean
  suggestedAsTutor: boolean
  blockedByPM: boolean
  reasonForBlockedByPM: string
  assessmentScore: number
  assessed: boolean
  accepted: boolean
}

interface StudentApplication {
  id: string
  student: Student
  studyDegree: StudyDegree
  currentSemester: string
  studyProgram: StudyProgram
  englishLanguageProficiency: LanguageProficiency
  germanLanguageProficiency: LanguageProficiency
  motivation: string
  experience: string
  devices: Device[]
  projectTeam?: ProjectTeam
  studentApplicationAssessment: StudentApplicationAssessment
}

interface InstructorComment {
  id?: string
  author: string
  timestamp?: string
  text: string
}

interface StudentApplicationSliceState {
  status: string
  error: string | null
  studentApplications: StudentApplication[]
}

const initialState: StudentApplicationSliceState = {
  status: 'idle',
  error: null,
  studentApplications: [],
}

export const studentApplicationsState = createSlice({
  name: 'studentApplications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStudentApplications.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchStudentApplications.fulfilled, (state, { payload }) => {
      state.studentApplications = payload
      state.status = 'idle'
    })

    builder.addCase(fetchStudentApplications.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createStudentApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createStudentApplication.fulfilled, (state, { payload }) => {
      state.studentApplications.push(payload)
      state.status = 'idle'
    })

    builder.addCase(createStudentApplication.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(updateStudentApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(updateStudentApplication.fulfilled, (state, { payload }) => {
      state.studentApplications = state.studentApplications.map((studentApplication) =>
        studentApplication.id === payload.id ? payload : studentApplication,
      )
      state.status = 'idle'
    })

    builder.addCase(updateStudentApplication.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createInstructorComment.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createInstructorComment.fulfilled, (state, { payload }) => {
      state.studentApplications.map((sa) => {
        return sa.id === payload.id ? payload : sa
      })
      state.status = 'idle'
    })

    builder.addCase(createInstructorComment.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(assignStudentApplicationToProjectTeam.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(assignStudentApplicationToProjectTeam.fulfilled, (state, { payload }) => {
      state.studentApplications = state.studentApplications.map((studentApplication) =>
        studentApplication.id === payload.id ? payload : studentApplication,
      )
      state.status = 'idle'
    })

    builder.addCase(assignStudentApplicationToProjectTeam.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(removeStudentApplicationFromProjectTeam.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(removeStudentApplicationFromProjectTeam.fulfilled, (state, { payload }) => {
      state.studentApplications = state.studentApplications.map((studentApplication) =>
        studentApplication.id === payload.id ? payload : studentApplication,
      )
      state.status = 'idle'
    })

    builder.addCase(removeStudentApplicationFromProjectTeam.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

// export const {} = studentApplicationsState.actions
export default studentApplicationsState.reducer
export {
  type Student,
  type StudentApplication,
  type InstructorComment,
  LanguageProficiency,
  StudyDegree,
  StudyProgram,
  Gender,
  Device,
}
