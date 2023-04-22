import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const deleteApplicationSemester = createAsyncThunk(
  'applicationSemesters/deleteApplicationSemester',

  async (applicationSemesterId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.delete(
          `http://localhost:8080/api/application-semesters/${applicationSemesterId}`,
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
