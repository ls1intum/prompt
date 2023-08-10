import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const fetchIntroCourseParticipations = createAsyncThunk(
  'introCourse/fetchIntroCourseParticipations',

  async (courseIterationName: string, { rejectWithValue }) => {
    try {
      return (
        await axios.get(
          `${serverBaseUrl}/api/intro-course?courseIteration=${courseIterationName}`,
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
