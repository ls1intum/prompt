import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type StudentApplicationNote } from '../studentApplicationSlice'

export const createStudentApplicationNote = createAsyncThunk(
  'studentApplications/createStudentApplicationNote',

  async ({
    studentApplicationId,
    studentApplicationNote,
  }: {
    studentApplicationId: string
    studentApplicationNote: StudentApplicationNote
  }) => {
    try {
      return (
        await axios.post(
          `http://localhost:8080/api/student-applications/${studentApplicationId}/notes`,
          studentApplicationNote,
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
