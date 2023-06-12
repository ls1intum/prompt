import { createSlice } from '@reduxjs/toolkit'
import { fetchAllCoursePhases } from './thunks/fetchAllCoursePhases'
import { createCoursePhaseCheck } from './thunks/createCoursePhaseCheck'
import { deleteCoursePhaseCheck } from './thunks/deleteCoursePhaseCheck'

interface CoursePhase {
  id: string
  name: string
  sequentialOrder: number
  type: CoursePhaseType
  checks: CoursePhaseCheck[]
}

interface CoursePhaseCheck {
  id: string
  title: string
  description: string
  sequentialOrder: number
}

enum CoursePhaseType {
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
}

interface CoursePhasesSliceState {
  status: string
  error: string | null
  coursePhases: CoursePhase[]
}

const initialState: CoursePhasesSliceState = {
  status: 'idle',
  error: null,
  coursePhases: [],
}

export const coursePhasesState = createSlice({
  name: 'coursePhases',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchAllCoursePhases.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchAllCoursePhases.fulfilled, (state, { payload }) => {
      state.coursePhases = payload
      state.status = 'idle'
    })

    builder.addCase(fetchAllCoursePhases.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createCoursePhaseCheck.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createCoursePhaseCheck.fulfilled, (state, { payload }) => {
      state.coursePhases = state.coursePhases.map((coursePhase) =>
        coursePhase.id === payload.id ? payload : coursePhase,
      )
      state.status = 'idle'
    })

    builder.addCase(createCoursePhaseCheck.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(deleteCoursePhaseCheck.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(deleteCoursePhaseCheck.fulfilled, (state, { payload }) => {
      state.coursePhases = state.coursePhases.map((coursePhase) =>
        coursePhase.id === payload.id ? payload : coursePhase,
      )
      state.status = 'idle'
    })

    builder.addCase(deleteCoursePhaseCheck.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

export default coursePhasesState.reducer
export { type CoursePhase, type CoursePhaseCheck, CoursePhaseType }
