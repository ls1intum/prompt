import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type StudentProjectTeamPreferenceSubmission } from '../studentProjectTeamPreferencesSlice'

export const createStudentProjectTeamPreferences = createAsyncThunk(
  'studentProjectTeamPreferencesSubmissions/createStudentProjectTeamPreferencesSubmission',

  async (
    studentProjectTeamPreferencesSubmission: StudentProjectTeamPreferenceSubmission,
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/project-team-preferences`,
          studentProjectTeamPreferencesSubmission,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
