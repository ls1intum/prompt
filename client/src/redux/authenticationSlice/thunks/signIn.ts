import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type SignInRequest } from '../authenticationSlice'

export const signIn = createAsyncThunk(
  'authentication/signIn',

  async (signInRequest: SignInRequest) => {
    try {
      return (await axios.post('http://localhost:8080/api/auth/signin', signInRequest)).data
    } catch (err) {
      console.log(err)
      return undefined
    }
  },
)
