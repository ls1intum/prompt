import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const deleteCoursePhase = createAsyncThunk(
  'coursePhases/deleteCoursePhase',

  async (coursePhaseId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.delete(`${serverBaseUrl}/api/course-phases/${coursePhaseId}`, {
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
