import { createSlice } from '@reduxjs/toolkit'
import { createStudentProjectTeamPreferences } from './thunks/createStudentProjectTeamPreferences'
import { fetchStudentProjectTeamPreferences } from './thunks/fetchStudentProjectTeamPreferences'
import { deleteStudentProjectTeamPreferences } from './thunks/deleteStudentProjectTeamPreferences'
import { type Student } from '../studentApplicationSlice/studentApplicationSlice'

interface StudentProjectTeamPreference {
  applicationSemesterId: string
  studentId: string
  projectTeamId: string
  priorityScore: number
  student?: Student
}

interface StudentProjectTeamPreferencesSliceState {
  status: string
  error: string | null
  studentProjectTeamPreferences: StudentProjectTeamPreference[]
}

const initialState: StudentProjectTeamPreferencesSliceState = {
  status: 'idle',
  error: null,
  studentProjectTeamPreferences: [],
}

export const studentProjectTeamPreferencesSlice = createSlice({
  name: 'studentProjectTeamPreferences',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStudentProjectTeamPreferences.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchStudentProjectTeamPreferences.fulfilled, (state, { payload }) => {
      state.studentProjectTeamPreferences = payload
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
      state.studentProjectTeamPreferences.push(payload)
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
      state.studentProjectTeamPreferences = []
      state.status = 'idle'
    })

    builder.addCase(deleteStudentProjectTeamPreferences.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

// export const {} = studentApplicationsState.actions
export default studentProjectTeamPreferencesSlice.reducer
export { type StudentProjectTeamPreference }
