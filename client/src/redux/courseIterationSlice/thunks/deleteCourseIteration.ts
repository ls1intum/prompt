import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const deleteCourseIteration = createAsyncThunk(
  'courseIterations/deleteCourseIteration',

  async (courseIterationId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.delete(`${serverBaseUrl}/api/course-iterations/${courseIterationId}`, {
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
