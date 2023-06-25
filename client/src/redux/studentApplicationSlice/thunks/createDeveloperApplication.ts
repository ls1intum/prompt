import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type DeveloperApplication } from '../studentApplicationSlice'
import { serverBaseUrl } from '../../../service/configService'

export const createDeveloperApplication = createAsyncThunk(
  'studentApplications/createDeveloperApplication',

  async (
    {
      application,
      courseIteration,
    }: {
      application: DeveloperApplication
      courseIteration: string
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/developer?courseIteration=${courseIteration}`,
          application,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
