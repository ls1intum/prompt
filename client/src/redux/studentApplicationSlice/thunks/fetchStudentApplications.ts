import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'

export const fetchStudentApplications = createAsyncThunk(
  'studentApplications/fetchAllStudentApplications',

  async (applicationSemester: string) => {
    try {
      return (
        await axios.get(
          `http://localhost:8080/api/student-applications?applicationSemester=${applicationSemester}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
            },
          },
        )
      ).data
    } catch (err) {
      console.log(err)
      return undefined
    }
  },
)
