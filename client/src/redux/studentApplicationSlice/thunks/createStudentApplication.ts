import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type StudentApplication } from '../studentApplicationSlice'

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
          `http://localhost:8080/api/student-applications?applicationSemester=${applicationSemester}`,
          studentApplication,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
