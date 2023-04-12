import { createSlice } from '@reduxjs/toolkit'
import { createProjectTeam } from './thunks/createProjectTeam'
import { deleteProjectTeam } from './thunks/deleteProjectTeam'
import { fetchProjectTeams } from './thunks/fetchProjectTeams'
import { updateProjectTeam } from './thunks/updateProjectTeam'

interface ProjectTeam {
  id: string
  name: string
  customer: string
}

interface ProjectTeamPatch {
  op: 'replace' | 'add' | 'remove' | 'copy'
  path: string
  value: string
}

interface ProjectTeamsSliceState {
  status: string
  error: string | null
  projectTeams: ProjectTeam[]
}

const initialState: ProjectTeamsSliceState = {
  status: 'idle',
  error: null,
  projectTeams: [],
}

export const projectTeamsSlice = createSlice({
  name: 'projectTeams',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProjectTeams.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchProjectTeams.fulfilled, (state, { payload }) => {
      state.projectTeams = payload
      state.status = 'idle'
    })

    builder.addCase(fetchProjectTeams.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createProjectTeam.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createProjectTeam.fulfilled, (state, { payload }) => {
      state.projectTeams.push(payload)
      state.status = 'idle'
    })

    builder.addCase(createProjectTeam.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(updateProjectTeam.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(updateProjectTeam.fulfilled, (state, { payload }) => {
      state.projectTeams = state.projectTeams.map((projectTeam) =>
        projectTeam.id === payload.id ? payload : projectTeam,
      )
      state.status = 'idle'
    })

    builder.addCase(updateProjectTeam.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(deleteProjectTeam.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(deleteProjectTeam.fulfilled, (state, { payload }) => {
      state.projectTeams = state.projectTeams.filter((projectTeam) => projectTeam.id !== payload)
      state.status = 'idle'
    })

    builder.addCase(deleteProjectTeam.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

// export const {} = studentApplicationsState.actions
export default projectTeamsSlice.reducer
export { type ProjectTeam, type ProjectTeamPatch }
