import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const deleteStudentProjectTeamPreferences = createAsyncThunk(
  'studentProjectTeamPreferences/deleteStudentProjectTeamPreferences',

  async (applicationSemesterName: string, { rejectWithValue }) => {
    try {
      return (
        await axios.delete(
          `http://localhost:8080/api/project-team-preferences?applicationSemester=${applicationSemesterName}`,
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
