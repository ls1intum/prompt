import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type ProjectTeam } from '../projectTeamsSlice'
import { serverBaseUrl } from '../../../service/configService'

export const createProjectTeam = createAsyncThunk(
  'projectTeams/createProjectTeam',

  async (
    {
      projectTeam,
      courseIteration,
    }: {
      projectTeam: ProjectTeam
      courseIteration: string
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/project-teams?courseIteration=${courseIteration}`,
          projectTeam,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
            },
          },
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
