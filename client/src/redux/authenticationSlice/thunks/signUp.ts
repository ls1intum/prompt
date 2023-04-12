import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type SignUpRequest } from '../authenticationSlice'

export const signUp = createAsyncThunk(
  'authentication/signUp',

  async (signUpRequest: SignUpRequest) => {
    try {
      return (await axios.post('http://localhost:8080/api/auth/signup', signUpRequest)).data
    } catch (err) {
      console.log(err)
      return undefined
    }
  },
)
