import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type StudentApplicationPatch } from '../studentApplicationSlice'

export const updateStudentApplication = createAsyncThunk(
  'studentApplications/updateStudentApplication',

  async (
    {
      studentApplicationId,
      studentApplicationPatch,
    }: {
      studentApplicationId: string
      studentApplicationPatch: StudentApplicationPatch[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(
          `http://localhost:8080/api/student-applications/${studentApplicationId}`,
          studentApplicationPatch,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
              'Content-Type': 'application/json-path+json',
            },
          },
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
