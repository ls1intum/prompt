import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const assignTechnicalChallengeScores = createAsyncThunk(
  'applications/assignTechnicalChallengeScores',

  async (
    {
      programmingScoreThreshold,
      quizScoreThreshold,
      scores,
    }: {
      programmingScoreThreshold: number
      quizScoreThreshold: number
      scores: Array<{
        developerApplicationId: string
        programmingScore: number
        quizScore: number
      }>
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/developer/technical-challenge-scores?
          programmingScoreThreshold=${programmingScoreThreshold}&quizScoreThreshold=${quizScoreThreshold}`,
          scores,
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
