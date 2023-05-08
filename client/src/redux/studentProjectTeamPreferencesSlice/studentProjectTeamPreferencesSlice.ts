import { createSlice } from '@reduxjs/toolkit'
import { createStudentProjectTeamPreferences } from './thunks/createStudentProjectTeamPreferences'
import { fetchStudentProjectTeamPreferences } from './thunks/fetchStudentProjectTeamPreferences'
import { deleteStudentProjectTeamPreferences } from './thunks/deleteStudentProjectTeamPreferences'
import { type Student } from '../studentApplicationSlice/studentApplicationSlice'

interface StudentProjectTeamPreference {
  projectTeamId: string
  priorityScore: number
}

interface StudentProjectTeamPreferenceSubmission {
  id?: string
  applicationSemesterId: string
  studentId: string
  student?: Student
  appleId: string
  studentProjectTeamPreferences: StudentProjectTeamPreference[]
}

interface StudentProjectTeamPreferencesSubmissionsSliceState {
  status: string
  error: string | null
  studentProjectTeamPreferencesSubmissions: StudentProjectTeamPreferenceSubmission[]
}

const initialState: StudentProjectTeamPreferencesSubmissionsSliceState = {
  status: 'idle',
  error: null,
  studentProjectTeamPreferencesSubmissions: [],
}

export const studentProjectTeamPreferencesSubmissionsSlice = createSlice({
  name: 'studentProjectTeamPreferencesSubmissions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStudentProjectTeamPreferences.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchStudentProjectTeamPreferences.fulfilled, (state, { payload }) => {
      state.studentProjectTeamPreferencesSubmissions = payload
      state.status = 'idle'
    })

    builder.addCase(fetchStudentProjectTeamPreferences.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createStudentProjectTeamPreferences.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createStudentProjectTeamPreferences.fulfilled, (state, { payload }) => {
      state.studentProjectTeamPreferencesSubmissions.push(payload)
      state.status = 'idle'
    })

    builder.addCase(createStudentProjectTeamPreferences.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(deleteStudentProjectTeamPreferences.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(deleteStudentProjectTeamPreferences.fulfilled, (state, { payload }) => {
      state.studentProjectTeamPreferencesSubmissions = []
      state.status = 'idle'
    })

    builder.addCase(deleteStudentProjectTeamPreferences.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

// export const {} = studentApplicationsState.actions
export default studentProjectTeamPreferencesSubmissionsSlice.reducer
export { type StudentProjectTeamPreference, type StudentProjectTeamPreferenceSubmission }
