import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const assignTechnicalChallengeProgrammingScores = createAsyncThunk(
  'applications/assignTechnicalChallengeProgrammingScores',

  async (
    {
      programmingScoreThreshold,
      programmingScores,
    }: {
      programmingScoreThreshold: number
      programmingScores: Map<string, number>
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/developer/technical-challenge/programming-scores?programmingScoreThreshold=${programmingScoreThreshold}`,
          Object.fromEntries(programmingScores),
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

export const assignTechnicalChallengeQuizScores = createAsyncThunk(
  'applications/assignTechnicalChallengeQuizScores',

  async (
    {
      quizScoreThreshold,
      quizScores,
    }: {
      quizScoreThreshold: number
      quizScores: Map<string, number>
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/developer/technical-challenge/quiz-scores?quizScoreThreshold=${quizScoreThreshold}`,
          Object.fromEntries(quizScores),
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
