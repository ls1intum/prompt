import { createSlice } from '@reduxjs/toolkit'
import { fetchSkills } from './thunks/fetchSkills'
import { createSkill } from './thunks/createSkill'
import { deleteSkill } from './thunks/deleteSkill'
import { toggleSkill } from './thunks/toggleSkill'

interface Skill {
  id?: string
  title: string
  description: string
  active: boolean
}

interface SkillSliceState {
  status: string
  error: string | null
  skills: Skill[]
}

const initialState: SkillSliceState = {
  status: 'idle',
  error: null,
  skills: [],
}

export const skillsState = createSlice({
  name: 'skills',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchSkills.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchSkills.fulfilled, (state, { payload }) => {
      state.skills = payload
      state.status = 'idle'
    })

    builder.addCase(fetchSkills.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createSkill.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createSkill.fulfilled, (state, { payload }) => {
      state.skills.push(payload)
      state.status = 'idle'
    })

    builder.addCase(createSkill.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(toggleSkill.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(toggleSkill.fulfilled, (state, { payload }) => {
      state.skills = state.skills.map((s) => (s.id === payload.id ? payload : s))
      state.status = 'idle'
    })

    builder.addCase(toggleSkill.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(deleteSkill.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(deleteSkill.fulfilled, (state, { payload }) => {
      state.skills = state.skills.filter((s) => s.id !== payload)
      state.status = 'idle'
    })

    builder.addCase(deleteSkill.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

export default skillsState.reducer
export { type Skill }
