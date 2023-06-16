import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const fetchStudentApplications = createAsyncThunk(
  'studentApplications/fetchAllStudentApplications',

  async (
    { courseIteration, accepted }: { courseIteration: string; accepted?: boolean },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.get(
          `${serverBaseUrl}/api/student-applications?courseIteration=${courseIteration}${
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
