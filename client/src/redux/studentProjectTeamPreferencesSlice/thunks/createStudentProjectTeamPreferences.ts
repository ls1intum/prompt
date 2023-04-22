import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const createStudentProjectTeamPreferences = createAsyncThunk(
  'studentProjectTea/createProjectTeam',

  async (
    {
      applicationSemesterName,
      studentId,
      preferences,
    }: {
      applicationSemesterName: string
      studentId: string
      preferences: Map<string, number>
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `http://localhost:8080/api/project-team-preferences/${studentId}?applicationSemester=${applicationSemesterName}`,
          preferences,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
