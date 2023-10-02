import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const acceptThesisApplication = createAsyncThunk(
  'thesisApplications/acceptThesisApplication',

  async (thesisApplicationId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/thesis-applications/${thesisApplicationId}/accept`,
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
