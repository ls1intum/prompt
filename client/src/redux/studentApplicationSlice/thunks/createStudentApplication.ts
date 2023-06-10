import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type StudentApplication } from '../studentApplicationSlice'
import { serverBaseUrl } from '../../../service/configService'

export const createStudentApplication = createAsyncThunk(
  'studentApplications/createStudentApplication',

  async (
    {
      studentApplication,
      courseIteration,
    }: {
      studentApplication: StudentApplication
      courseIteration: string
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/student-applications?courseIteration=${courseIteration}`,
          studentApplication,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
