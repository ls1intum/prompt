import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const rejectThesisApplication = createAsyncThunk(
  'thesisApplications/rejectThesisApplication',

  async (thesisApplicationId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/thesis-applications/${thesisApplicationId}/reject`,
          {},
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
