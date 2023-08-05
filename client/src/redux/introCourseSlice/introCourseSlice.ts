import { createSlice } from '@reduxjs/toolkit'
import { type Application } from '../applicationsSlice/applicationsSlice'
import { fetchIntroCourseParticipations } from './thunks/fetchIntroCourseParticipations'
import { updateIntroCourseParticipation } from './thunks/updateIntroCourseParticipation'

interface IntroCourseParticipation {
  id: string
  tutorApplicationId?: string
  developerApplication: Application
  seat?: string
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
      state.participations = payload.map((introCourseParticipation: IntroCourseParticipation) => ({
        ...introCourseParticipation,
        developerApplication: {
          ...introCourseParticipation.developerApplication,
          type: 'DEVELOPER',
        },
      }))
      state.status = 'idle'
    })

    builder.addCase(fetchIntroCourseParticipations.rejected, (state, { payload }) => {
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
export { type IntroCourseParticipation }
