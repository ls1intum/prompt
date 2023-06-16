import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const deleteStudentProjectTeamPreferences = createAsyncThunk(
  'studentPostKickoffSubmissions/deleteStudentProjectTeamPreferences',

  async (courseIteration: string, { rejectWithValue }) => {
    try {
      return (
        await axios.delete(
          `${serverBaseUrl}/api/post-kickoff-submissions/project-team-preferences?courseIteration=${courseIteration}`,
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
