import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const removeDeveloperApplicationFromProjectTeam = createAsyncThunk(
  'studentApplications/removeDeveloperApplicationFromProjectTeam',

  async (
    {
      applicationId,
      courseIteration,
    }: {
      applicationId: string
      courseIteration: string
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.delete(
          `${serverBaseUrl}/api/applications/${applicationId}/project-team?courseIteration=${courseIteration}`,
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
