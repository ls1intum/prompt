import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createApplicationSemester } from './thunks/createApplicationSemester'
import {
  fetchAllApplicationSemesters,
  fetchApplicationSemestersWithOpenApplicationPeriod,
} from './thunks/fetchApplicationSemesters'

interface ApplicationSemesterRequest {
  semesterName: string
  applicationPeriodStart: Date
  applicationPeriodEnd: Date
}

interface ApplicationSemester {
  id: number
  semesterName: string
}

interface ApplicationSemesterSliceState {
  status: string
  error: string | null
  currentState: ApplicationSemester | undefined
  applicationSemesters: ApplicationSemester[]
  openApplicationSemester: ApplicationSemester | undefined
}

const initialState: ApplicationSemesterSliceState = {
  status: 'idle',
  error: null,
  currentState: undefined,
  applicationSemesters: [],
  openApplicationSemester: undefined,
}

export const applicationSemesterState = createSlice({
  name: 'applicationSemester',
  initialState,
  reducers: {
    setCurrentState: (state, action: PayloadAction<ApplicationSemester>) => {
      state.currentState = action.payload
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllApplicationSemesters.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchAllApplicationSemesters.fulfilled, (state, { payload }) => {
      state.applicationSemesters = payload
      state.status = 'idle'
    })

    builder.addCase(fetchAllApplicationSemesters.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(fetchApplicationSemestersWithOpenApplicationPeriod.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(
      fetchApplicationSemestersWithOpenApplicationPeriod.fulfilled,
      (state, { payload }) => {
        state.openApplicationSemester = payload
        state.status = 'idle'
      },
    )

    builder.addCase(
      fetchApplicationSemestersWithOpenApplicationPeriod.rejected,
      (state, { payload }) => {
        if (payload) state.error = 'error'
        state.status = 'idle'
      },
    )

    builder.addCase(createApplicationSemester.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createApplicationSemester.fulfilled, (state, { payload }) => {
      state.applicationSemesters.push(payload)
      state.status = 'idle'
    })

    builder.addCase(createApplicationSemester.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

export const { setCurrentState } = applicationSemesterState.actions
export default applicationSemesterState.reducer
export { type ApplicationSemester, type ApplicationSemesterRequest }
