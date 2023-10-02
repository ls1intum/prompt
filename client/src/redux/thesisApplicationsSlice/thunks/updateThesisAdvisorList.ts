import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'
import { type ThesisAdvisor } from '../thesisApplicationsSlice'

export const updateThesisAdvisorList = createAsyncThunk(
  'thesisApplications/updateThesisAdvisorList',

  async (thesisAdvisor: ThesisAdvisor, { rejectWithValue }) => {
    try {
      return (
        await axios.put(`${serverBaseUrl}/api/thesis-applications/thesis-advisors`, thesisAdvisor, {
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
