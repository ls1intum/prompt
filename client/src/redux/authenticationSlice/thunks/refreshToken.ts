import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const refreshToken = createAsyncThunk(
  'authentication/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      return (
        await axios.post(`${serverBaseUrl}/api/auth/refresh-token`, {
          refreshToken: localStorage.getItem('refreshToken'),
        })
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
