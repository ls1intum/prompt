import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type CoachApplication } from '../applicationsSlice'
import { serverBaseUrl } from '../../../service/configService'

export const createCoachApplication = createAsyncThunk(
  'studentApplications/createCoachApplication',

  async (
    {
      application,
      courseIteration,
    }: {
      application: CoachApplication
      courseIteration: string
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/coach?courseIteration=${courseIteration}`,
          application,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
