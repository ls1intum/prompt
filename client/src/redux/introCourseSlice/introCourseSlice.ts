import { createSlice } from '@reduxjs/toolkit'
import { type Student } from '../applicationsSlice/applicationsSlice'
import { fetchIntroCourseParticipations } from './thunks/fetchIntroCourseParticipations'
import { updateIntroCourseParticipation } from './thunks/updateIntroCourseParticipation'
import { createSeatPlanAssignments } from './thunks/createSeatPlanAssignments'
import { createSeatPlan } from './thunks/createSeatPlan'
import { createIntroCourseAbsence } from './thunks/createIntroCourseAbsence'
import { fetchAllIntroCourseTutors } from './thunks/fetchAllIntroCourseTutors'
import { deleteIntroCourseAbsence } from './thunks/deleteIntroCourseAbsence'
import { type SkillProficiency } from '../studentPostKickoffSubmissionsSlice/studentPostKickoffSubmissionsSlice'

interface IntroCourseAbsence {
  id: string
  date: Date
  excuse: string
}

interface TechnicalDetails {
  appleId: string
  macBookDeviceId?: string
  iPhoneDeviceId?: string
  iPadDeviceId?: string
  appleWatchDeviceId?: string
}

interface IntroCourseParticipation {
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
}

interface SeatPlanAssignment {
  introCourseParticipationId: string
  seat: string
  tutorId?: string
}

interface Seat {
  seat: string
  tutorId?: string
  chairDevice: string
}

interface IntroCourseSliceState {
  status: string
  error: string | null
  participations: IntroCourseParticipation[]
  tutors: Student[]
}

const initialState: IntroCourseSliceState = {
  status: 'idle',
  error: null,
  participations: [],
  tutors: [],
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

    builder.addCase(fetchAllIntroCourseTutors.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchAllIntroCourseTutors.fulfilled, (state, { payload }) => {
      state.tutors = payload
      state.status = 'idle'
    })

    builder.addCase(fetchAllIntroCourseTutors.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(updateIntroCourseParticipation.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(updateIntroCourseParticipation.fulfilled, (state, { payload }) => {
      state.participations = state.participations.map((introCourseParticipation) =>
        introCourseParticipation.id === payload.id ? payload : introCourseParticipation,
      )
      state.status = 'idle'
    })

    builder.addCase(updateIntroCourseParticipation.rejected, (state, { payload }) => {
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

    builder.addCase(createIntroCourseAbsence.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createIntroCourseAbsence.fulfilled, (state, { payload }) => {
      state.participations = state.participations.map((introCourseParticipation) =>
        introCourseParticipation.id === payload.id ? payload : introCourseParticipation,
      )
      state.status = 'idle'
    })

    builder.addCase(createIntroCourseAbsence.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(deleteIntroCourseAbsence.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(deleteIntroCourseAbsence.fulfilled, (state, { payload }) => {
      state.participations = state.participations.map((introCourseParticipation) =>
        introCourseParticipation.id === payload.id ? payload : introCourseParticipation,
      )
      state.status = 'idle'
    })

    builder.addCase(deleteIntroCourseAbsence.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

export default introCourseSlice.reducer
export {
  type IntroCourseParticipation,
  type TechnicalDetails,
  type IntroCourseAbsence,
  type SeatPlanAssignment,
  type Seat,
}
