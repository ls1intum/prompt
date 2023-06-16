import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const fetchStudentPostKickoffSubmissions = createAsyncThunk(
  'studentPostKickoffSubmissions/fetchStudentPostKickoffSubmissions',

  async (courseIteration: string, { rejectWithValue }) => {
    try {
      return (
        await axios.get(
          `${serverBaseUrl}/api/post-kickoff-submissions?courseIteration=${courseIteration}`,
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
