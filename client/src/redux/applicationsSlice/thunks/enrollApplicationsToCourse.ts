import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const enrollDeveloperApplicationsToCourse = createAsyncThunk(
  'applications/enrollDeveloperApplicationsToCourse',

  async (developerApplicationIds: string[], { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/developer/enrollment`,
          developerApplicationIds,
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

export const enrollCoachApplicationsToCourse = createAsyncThunk(
  'applications/enrollCoachApplicationsToCourse',

  async (coachApplicationIds: string[], { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/coach/enrollment`,
          coachApplicationIds,
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

export const enrollTutorApplicationsToCourse = createAsyncThunk(
  'applications/enrollTutorApplicationsToCourse',

  async (tutorApplicationIds: string[], { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/tutor/enrollment`,
          tutorApplicationIds,
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
