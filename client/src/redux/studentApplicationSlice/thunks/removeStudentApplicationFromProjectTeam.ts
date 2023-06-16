import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const removeStudentApplicationFromProjectTeam = createAsyncThunk(
  'studentApplications/removeStudentApplicationFromProjectTeam',

  async (
    {
      studentApplicationId,
      courseIteration,
    }: {
      studentApplicationId: string
      courseIteration: string
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.delete(
          `${serverBaseUrl}/api/student-applications/${studentApplicationId}/project-team?courseIteration=${courseIteration}`,
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
