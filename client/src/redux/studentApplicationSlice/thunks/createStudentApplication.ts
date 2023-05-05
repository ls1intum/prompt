import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type StudentApplication } from '../studentApplicationSlice'
import { serverBaseUrl } from '../../../service/configService'

export const createStudentApplication = createAsyncThunk(
  'studentApplications/createStudentApplication',

  async (
    {
      studentApplication,
      applicationSemester,
    }: {
      studentApplication: StudentApplication
      applicationSemester: string
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/student-applications?applicationSemester=${applicationSemester}`,
          studentApplication,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
