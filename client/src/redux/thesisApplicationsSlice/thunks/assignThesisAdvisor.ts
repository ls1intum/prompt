import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

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
        await axios.post(
          `${serverBaseUrl}/api/thesis-applications/${thesisApplicationId}/thesis-advisor/${thesisAdvisorId}`,
          {},
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
