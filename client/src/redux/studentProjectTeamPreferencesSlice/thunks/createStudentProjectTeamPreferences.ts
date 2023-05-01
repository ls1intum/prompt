import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

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
          `${serverBaseUrl}/api/project-team-preferences/${studentId}?applicationSemester=${applicationSemesterName}`,
          preferences,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
