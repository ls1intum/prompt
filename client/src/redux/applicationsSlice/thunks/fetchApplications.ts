import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const fetchDeveloperApplications = createAsyncThunk(
  'applications/fetchDeveloperApplications',

  async (
    { courseIteration, accepted }: { courseIteration: string; accepted?: boolean },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.get(
          `${serverBaseUrl}/api/applications/developer?courseIteration=${courseIteration}${
            accepted ? '&accepted=true' : ''
          }`,
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

export const fetchCoachApplications = createAsyncThunk(
  'applications/fetchCoachApplications',

  async (
    { courseIteration, accepted }: { courseIteration: string; accepted?: boolean },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.get(
          `${serverBaseUrl}/api/applications/coach?courseIteration=${courseIteration}${
            accepted ? '&accepted=true' : ''
          }`,
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

export const fetchTutorApplications = createAsyncThunk(
  'applications/fetchTutorApplications',

  async (
    { courseIteration, accepted }: { courseIteration: string; accepted?: boolean },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.get(
          `${serverBaseUrl}/api/applications/tutor?courseIteration=${courseIteration}${
            accepted ? '&accepted=true' : ''
          }`,
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
