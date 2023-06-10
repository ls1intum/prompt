import { createSlice, type PayloadAction } from '@reduxjs/toolkit'
import { createCourseIteration } from './thunks/createCourseIteration'
import {
  fetchAllCourseIterations,
  fetchCourseIterationsWithOpenApplicationPeriod,
} from './thunks/fetchAllCourseIterations'
import { deleteCourseIteration } from './thunks/deleteCourseIteration'
import { updateCourseIteration } from './thunks/updateCourseIteration'

interface CourseIterationRequest {
  semesterName: string
  applicationPeriodStart: Date
  applicationPeriodEnd: Date
  iosTag: string
}

interface CourseIteration {
  id: string
  semesterName: string
  applicationPeriodStart: Date
  applicationPeriodEnd: Date
  iosTag: string
}

enum ApplicationSemesterPhase {
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

interface CourseIterationSliceState {
  status: string
  error: string | null
  currentState: CourseIteration | undefined
  courseIterations: CourseIteration[]
  courseIterationWithOpenApplicationPeriod: CourseIteration | undefined
}

const initialState: CourseIterationSliceState = {
  status: 'idle',
  error: null,
  currentState: undefined,
  courseIterations: [],
  courseIterationWithOpenApplicationPeriod: undefined,
}

export const courseIterationState = createSlice({
  name: 'courseIterations',
  initialState,
  reducers: {
    setCurrentState: (state, action: PayloadAction<CourseIteration>) => {
      state.currentState = action.payload
      localStorage.setItem('course-iteration', action.payload.id)
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchAllCourseIterations.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchAllCourseIterations.fulfilled, (state, { payload }) => {
      state.courseIterations = payload
      state.status = 'idle'
    })

    builder.addCase(fetchAllCourseIterations.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(fetchCourseIterationsWithOpenApplicationPeriod.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(
      fetchCourseIterationsWithOpenApplicationPeriod.fulfilled,
      (state, { payload }) => {
        state.courseIterationWithOpenApplicationPeriod = payload
        state.status = 'idle'
      },
    )

    builder.addCase(
      fetchCourseIterationsWithOpenApplicationPeriod.rejected,
      (state, { payload }) => {
        if (payload) state.error = 'error'
        state.status = 'idle'
      },
    )

    builder.addCase(createCourseIteration.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createCourseIteration.fulfilled, (state, { payload }) => {
      state.courseIterations.push(payload)
      state.status = 'idle'
    })

    builder.addCase(createCourseIteration.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(deleteCourseIteration.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(deleteCourseIteration.fulfilled, (state, { payload }) => {
      state.courseIterations = state.courseIterations.filter(
        (courseIteration) => courseIteration.id !== payload,
      )
      state.status = 'idle'
    })

    builder.addCase(deleteCourseIteration.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(updateCourseIteration.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(updateCourseIteration.fulfilled, (state, { payload }) => {
      state.courseIterations = state.courseIterations.map((courseIteration) => {
        if (courseIteration.id === payload.id) {
          return payload
        }
        return courseIteration
      })
      state.status = 'idle'
    })

    builder.addCase(updateCourseIteration.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

export const { setCurrentState } = courseIterationState.actions
export default courseIterationState.reducer
export { type CourseIteration, type CourseIterationRequest, ApplicationSemesterPhase }
