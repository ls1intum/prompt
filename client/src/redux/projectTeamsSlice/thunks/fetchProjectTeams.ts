import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchProjectTeams = createAsyncThunk(
  'projectTeams/fetchAllProjectTeams',

  async (applicationSemester: string, { rejectWithValue }) => {
    try {
      return (
        await axios.get(
          `http://localhost:8080/api/project-teams?applicationSemester=${applicationSemester}`,
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
