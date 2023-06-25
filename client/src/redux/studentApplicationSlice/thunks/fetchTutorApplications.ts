import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const fetchTutorApplications = createAsyncThunk(
  'studentApplications/fetchTutorApplications',

  async (
    { courseIteration, accepted }: { courseIteration: string; accepted?: boolean },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.get(
          `${serverBaseUrl}/api/applications/tutor?courseIteration=${courseIteration}${
            accepted ? '&accepted=true' : ''
          }`,
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
