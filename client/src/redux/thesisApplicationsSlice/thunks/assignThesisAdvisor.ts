import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../service/configService'

export const assignThesisAdvisor = createAsyncThunk(
  'thesisApplications/assignThesisAdvisor',

  async (
    {
      thesisApplicationId,
      thesisAdvisorId,
    }: { thesisApplicationId: string; thesisAdvisorId: string },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axiosInstance.post(
          `/api/thesis-applications/${thesisApplicationId}/thesis-advisor/${thesisAdvisorId}`,
          {},
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
