import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type ApplicationSemesterPatch } from '../applicationSemesterSlice'

export const updateApplicationSemester = createAsyncThunk(
  'applicationSemesters/updateApplicationSemester',

  async (
    {
      applicationSemesterId,
      applicationSemesterPatch,
    }: {
      applicationSemesterId: string
      applicationSemesterPatch: ApplicationSemesterPatch[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(
          `http://localhost:8080/api/application-semesters/${applicationSemesterId}`,
          applicationSemesterPatch,
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
