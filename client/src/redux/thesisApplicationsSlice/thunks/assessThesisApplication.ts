import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../service/configService'
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
        await axiosInstance.post(`/api/thesis-applications/${thesisApplicationId}/assessment`, {
          ...assessment,
        })
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
