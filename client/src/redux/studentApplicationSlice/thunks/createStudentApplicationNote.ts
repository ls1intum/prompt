import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type StudentApplicationNote } from '../studentApplicationSlice'
import { serverBaseUrl } from '../../../service/configService'

export const createStudentApplicationNote = createAsyncThunk(
  'studentApplications/createStudentApplicationNote',

  async (
    {
      studentApplicationId,
      studentApplicationNote,
    }: {
      studentApplicationId: string
      studentApplicationNote: StudentApplicationNote
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/student-applications/${studentApplicationId}/notes`,
          studentApplicationNote,
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
