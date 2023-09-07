import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'
import { type ApplicationStatus } from '../../applicationsSlice/applicationsSlice'

export const fetchThesisApplications = createAsyncThunk(
  'thesisApplications/fetchThesisApplications',

  async (status: ApplicationStatus, { rejectWithValue }) => {
    try {
      return (
        await axios.get(`${serverBaseUrl}/api/thesis-applications`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          },
        })
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
