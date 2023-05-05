import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type ProjectTeamPatch } from '../projectTeamsSlice'
import { serverBaseUrl } from '../../../service/configService'

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
        await axios.patch(`${serverBaseUrl}/api/project-teams/${projectTeamId}`, projectTeamPatch, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
            'Content-Type': 'application/json-path+json',
          },
        })
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
