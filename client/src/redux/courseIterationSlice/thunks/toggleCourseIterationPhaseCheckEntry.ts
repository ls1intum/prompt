import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const toggleCourseIterationPhaseCheckEntry = createAsyncThunk(
  'courseIterations/toggleCourseIterationPhaseCheckEntry',

  async (
    {
      courseIterationId,
      courseIterationPhaseCheckEntryId,
    }: { courseIterationId: string; courseIterationPhaseCheckEntryId: string },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/course-iterations/${courseIterationId}/course-iteration-phase-check-entries/${courseIterationPhaseCheckEntryId}`,
          {},
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
