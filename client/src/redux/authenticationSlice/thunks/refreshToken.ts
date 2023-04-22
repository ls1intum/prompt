import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const refreshToken = createAsyncThunk(
  'authentication/refreshToken',
  async (_, { rejectWithValue }) => {
    try {
      return (
        await axios.post('http://localhost:8080/api/auth/refresh-token', {
          refreshToken: localStorage.getItem('refreshToken'),
        })
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
