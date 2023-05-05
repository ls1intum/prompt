import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const fetchProjectTeams = createAsyncThunk(
  'projectTeams/fetchAllProjectTeams',

  async (applicationSemester: string, { rejectWithValue }) => {
    try {
      return (
        await axios.get(
          `${serverBaseUrl}/api/project-teams?applicationSemester=${applicationSemester}`,
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
