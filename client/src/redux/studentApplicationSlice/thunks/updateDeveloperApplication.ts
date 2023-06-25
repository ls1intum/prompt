import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type Patch, serverBaseUrl } from '../../../service/configService'

export const updateDeveloperApplication = createAsyncThunk(
  'studentApplications/updateDeveloperApplication',

  async (
    {
      applicationId,
      applicationPatch,
    }: {
      applicationId: string
      applicationPatch: Patch[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(
          `${serverBaseUrl}/api/applications/developer/${applicationId}`,
          applicationPatch,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
              'Content-Type': 'application/json-path+json',
            },
          },
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
