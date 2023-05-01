import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type SignUpRequest } from '../authenticationSlice'
import { serverBaseUrl } from '../../../service/configService'

export const signUp = createAsyncThunk(
  'authentication/signUp',

  async (signUpRequest: SignUpRequest, { rejectWithValue }) => {
    try {
      return (await axios.post(`${serverBaseUrl}/api/auth/signup`, signUpRequest)).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
