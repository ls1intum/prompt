import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const assignTechnicalChallengeScores = createAsyncThunk(
  'applications/assignTechnicalChallengeScores',

  async (developerApplicationIdToScoreMap: Map<string, number>, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/developer/technical-challenge-scores`,
          Object.fromEntries(developerApplicationIdToScoreMap),
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
