import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type CourseIterationRequest } from '../courseIterationSlice'

export const createCourseIteration = createAsyncThunk(
  'courseIterations/createCourseIteration',

  async (courseIteration: CourseIterationRequest, { rejectWithValue }) => {
    try {
      return (
        await axios.post(`${serverBaseUrl}/api/course-iterations`, courseIteration, {
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
