import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type CoursePhase } from '../coursePhasesSlice'

export const createCoursePhase = createAsyncThunk(
  'coursePhases/createCoursePhase',

  async (coursePhase: CoursePhase, { rejectWithValue }) => {
    try {
      return (
        await axios.post(`${serverBaseUrl}/api/course-phases`, coursePhase, {
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
