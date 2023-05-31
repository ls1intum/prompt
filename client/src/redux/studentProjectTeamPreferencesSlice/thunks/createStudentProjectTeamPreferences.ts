import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type StudentProjectTeamPreferenceSubmission } from '../studentProjectTeamPreferencesSlice'

export const createStudentProjectTeamPreferences = createAsyncThunk(
  'studentProjectTeamPreferencesSubmissions/createStudentProjectTeamPreferencesSubmission',

  async (
    {
      studentPublicId,
      studentMatriculationNumber,
      studentProjectTeamPreferencesSubmission,
    }: {
      studentPublicId: string
      studentMatriculationNumber: string
      studentProjectTeamPreferencesSubmission: StudentProjectTeamPreferenceSubmission
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/project-team-preferences/${studentPublicId}?studentMatriculationNumber=${studentMatriculationNumber}`,
          studentProjectTeamPreferencesSubmission,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
