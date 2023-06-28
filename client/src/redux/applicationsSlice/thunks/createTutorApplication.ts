import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type TutorApplication } from '../applicationsSlice'
import { serverBaseUrl } from '../../../service/configService'

export const createTutorApplication = createAsyncThunk(
  'studentApplications/createTutorApplication',

  async (
    {
      application,
      courseIteration,
    }: {
      application: TutorApplication
      courseIteration: string
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/tutor?courseIteration=${courseIteration}`,
          application,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
