import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../service/configService'

export const fetchThesisAdvisors = createAsyncThunk(
  'thesisApplications/fetchThesisAdvisors',

  async () => {
    try {
      return (await axiosInstance.get(`/api/thesis-applications/thesis-advisors`)).data
    } catch (err) {}
  },
)
