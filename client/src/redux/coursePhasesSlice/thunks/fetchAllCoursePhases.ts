import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const fetchAllCoursePhases = createAsyncThunk(
  'coursePhases/fetchAllCoursePhases',

  async (_, { rejectWithValue }) => {
    try {
      return (
        await axios.get(`${serverBaseUrl}/api/course-phases`, {
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
