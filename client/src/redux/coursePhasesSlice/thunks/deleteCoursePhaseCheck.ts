import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const deleteCoursePhaseCheck = createAsyncThunk(
  'coursePhases/deleteCoursePhaseCheck',

  async (
    { coursePhaseId, coursePhaseCheckId }: { coursePhaseId: string; coursePhaseCheckId: string },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.delete(
          `${serverBaseUrl}/api/course-phases/${coursePhaseId}/course-phase-checks/${coursePhaseCheckId}`,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
            },
          },
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
