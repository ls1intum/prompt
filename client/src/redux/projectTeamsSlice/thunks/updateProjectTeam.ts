import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type ProjectTeamPatch } from '../projectTeamsSlice'

export const updateProjectTeam = createAsyncThunk(
  'projectTeams/updateProjectTeam',

  async (
    {
      projectTeamId,
      projectTeamPatch,
    }: {
      projectTeamId: string
      projectTeamPatch: ProjectTeamPatch[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(
          `http://localhost:8080/api/project-teams/${projectTeamId}`,
          projectTeamPatch,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
              'Content-Type': 'application/json-path+json',
            },
          },
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
