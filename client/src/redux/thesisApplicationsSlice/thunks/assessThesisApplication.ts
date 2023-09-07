import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'
import { type ApplicationStatus } from '../../applicationsSlice/applicationsSlice'

export const assessThesisApplication = createAsyncThunk(
  'thesisApplications/assessThesisApplication',

  async (
    {
      thesisApplicationId,
      assessment,
    }: {
      thesisApplicationId: string
      assessment: { status: keyof typeof ApplicationStatus; assessmentComment: string }
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/thesis-applications/${thesisApplicationId}/assessment`,
          { ...assessment },
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
