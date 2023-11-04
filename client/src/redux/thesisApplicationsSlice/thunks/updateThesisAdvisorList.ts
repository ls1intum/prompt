import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../service/configService'
import { type ThesisAdvisor } from '../thesisApplicationsSlice'

export const updateThesisAdvisorList = createAsyncThunk(
  'thesisApplications/updateThesisAdvisorList',

  async (thesisAdvisor: ThesisAdvisor, { rejectWithValue }) => {
    try {
      return (await axiosInstance.put(`/api/thesis-applications/thesis-advisors`, thesisAdvisor))
        .data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
