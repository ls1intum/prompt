import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../service/configService'
import { type ApplicationStatus } from '../../applicationsSlice/applicationsSlice'

export const fetchThesisApplications = createAsyncThunk(
  'thesisApplications/fetchThesisApplications',

  async (status: ApplicationStatus, { rejectWithValue }) => {
    try {
      return (await axiosInstance.get(`/api/thesis-applications`)).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
