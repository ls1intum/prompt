import { createSlice } from '@reduxjs/toolkit'
import { type ProjectTeam } from '../projectTeamsSlice/projectTeamsSlice'
import { assignStudentApplicationToProjectTeam } from './thunks/assignStudentApplicationToProjectTeam'
import { createStudentApplication } from './thunks/createStudentApplication'
import { createStudentApplicationNote } from './thunks/createStudentApplicationNote'
import { fetchStudentApplications } from './thunks/fetchStudentApplications'
import { removeStudentApplicationFromProjectTeam } from './thunks/removeStudentApplicationFromProjectTeam'
import { updateStudentApplication } from './thunks/updateStudentApplication'

interface Student {
  id: ''
  tumId: string
  matriculationNumber: string
  isExchangeStudent: boolean
  firstName: string
  lastName: string
  gender: string
  nationality: string
  email: string
}

interface StudentApplication {
  id: string
  student: Student
  studyDegree: string
  currentSemester: string
  studyProgram: string
  motivation: string
  experience: string
  notes: StudentApplicationNote[]
  suggestedAsCoach: boolean
  suggestedAsTutor: boolean
  blockedByPM: boolean
  reasonForBlockedByPM: string
  assessmentScore: number
  assessed: boolean
  accepted: boolean
  projectTeam?: ProjectTeam
}

interface StudentApplicationPatch {
  op: 'replace' | 'add' | 'remove' | 'copy'
  path: string
  value: string
}

interface StudentApplicationNote {
  id?: string
  author: User
  timestamp?: string
  comment: string
}

interface User {
  id: string
  username?: string
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

    builder.addCase(createStudentApplicationNote.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createStudentApplicationNote.fulfilled, (state, { payload }) => {
      state.studentApplications.push(payload)
      state.status = 'idle'
    })

    builder.addCase(createStudentApplicationNote.rejected, (state, { payload }) => {
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
  type StudentApplicationNote,
  type StudentApplicationPatch,
}
