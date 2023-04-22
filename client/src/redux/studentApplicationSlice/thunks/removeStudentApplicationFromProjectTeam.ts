import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const removeStudentApplicationFromProjectTeam = createAsyncThunk(
  'studentApplications/removeStudentApplicationFromProjectTeam',

  async (
    {
      studentApplicationId,
      applicationSemester,
    }: {
      studentApplicationId: string
      applicationSemester: string
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.delete(
          `http://localhost:8080/api/student-applications/${studentApplicationId}/project-team?applicationSemester=${applicationSemester}`,
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
