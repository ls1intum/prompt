import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type SignInRequest } from '../authenticationSlice'
import { serverBaseUrl } from '../../../service/configService'

export const signIn = createAsyncThunk(
  'authentication/signIn',

  async (signInRequest: SignInRequest, { rejectWithValue }) => {
    try {
      return (await axios.post(`${serverBaseUrl}/api/auth/signin`, signInRequest)).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
