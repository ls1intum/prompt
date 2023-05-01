import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const deleteProjectTeam = createAsyncThunk(
  'projectTeams/deleteProjectTeam',

  async (projectTeamId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.delete(`${serverBaseUrl}/api/project-teams/${projectTeamId}`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          },
        })
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
