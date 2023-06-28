import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type Patch, serverBaseUrl } from '../../../service/configService'

export const updateDeveloperApplicationAssessment = createAsyncThunk(
  'studentApplications/updateDeveloperApplicationAssessment',

  async (
    {
      applicationId,
      applicationAssessmentPatch,
    }: {
      applicationId: string
      applicationAssessmentPatch: Patch[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(
          `${serverBaseUrl}/api/applications/developer/${applicationId}/assessment`,
          applicationAssessmentPatch,
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
