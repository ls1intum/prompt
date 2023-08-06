import { createSlice } from '@reduxjs/toolkit'
import { type Student } from '../applicationsSlice/applicationsSlice'
import { fetchIntroCourseParticipations } from './thunks/fetchIntroCourseParticipations'
import { updateIntroCourseParticipation } from './thunks/updateIntroCourseParticipation'
import { createSeatPlanAssignments } from './thunks/createSeatPlanAssignments'
import { createSeatPlan } from './thunks/createSeatPlan'

interface IntroCourseParticipation {
  id: string
  tutorId?: string
  student: Student
  seat?: string
  chairDeviceRequired: boolean
}

interface SeatPlanAssignment {
  introCourseParticipationId: string
  seat: string
  tutorId?: string
}

interface Seat {
  seat: string
  withChairDevice: boolean
}

interface IntroCourseSliceState {
  status: string
  error: string | null
  participations: IntroCourseParticipation[]
}

const initialState: IntroCourseSliceState = {
  status: 'idle',
  error: null,
  participations: [],
}

export const introCourseSlice = createSlice({
  name: 'introCourse',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchIntroCourseParticipations.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchIntroCourseParticipations.fulfilled, (state, { payload }) => {
      state.participations = payload
      state.status = 'idle'
    })

    builder.addCase(fetchIntroCourseParticipations.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createSeatPlanAssignments.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createSeatPlanAssignments.fulfilled, (state, { payload }) => {
      state.participations = state.participations.map((introCourseParticipation) =>
        payload.some(
          (updatedIntroCourseParticipation: IntroCourseParticipation) =>
            updatedIntroCourseParticipation.id === introCourseParticipation.id,
        )
          ? payload.find(
              (updatedIntroCourseParticipation: IntroCourseParticipation) =>
                updatedIntroCourseParticipation.id === introCourseParticipation.id,
            )
          : introCourseParticipation,
      )
      state.status = 'idle'
    })

    builder.addCase(createSeatPlanAssignments.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createSeatPlan.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createSeatPlan.fulfilled, (state, { payload }) => {
      state.participations = state.participations.map((introCourseParticipation) =>
        payload.some(
          (updatedIntroCourseParticipation: IntroCourseParticipation) =>
            updatedIntroCourseParticipation.id === introCourseParticipation.id,
        )
          ? payload.find(
              (updatedIntroCourseParticipation: IntroCourseParticipation) =>
                updatedIntroCourseParticipation.id === introCourseParticipation.id,
            )
          : introCourseParticipation,
      )
      state.status = 'idle'
    })

    builder.addCase(createSeatPlan.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(updateIntroCourseParticipation.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(updateIntroCourseParticipation.fulfilled, (state, { payload }) => {
      state.participations = state.participations.map((introCourseParticipation) =>
        introCourseParticipation.id === payload.id
          ? {
              ...payload,
              developerApplication: {
                ...payload.developerApplication,
                type: 'DEVELOPER',
              },
            }
          : introCourseParticipation,
      )
      state.status = 'idle'
    })

    builder.addCase(updateIntroCourseParticipation.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

export default introCourseSlice.reducer
export { type IntroCourseParticipation, type SeatPlanAssignment, type Seat }
