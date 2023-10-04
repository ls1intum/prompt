import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const fetchThesisAdvisors = createAsyncThunk(
  'thesisApplications/fetchThesisAdvisors',

  async () => {
    try {
      return (
        await axios.get(`${serverBaseUrl}/api/thesis-applications/thesis-advisors`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          },
        })
      ).data
    } catch (err) {}
  },
)
