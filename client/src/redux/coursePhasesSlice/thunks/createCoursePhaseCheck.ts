import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type CoursePhaseCheck } from '../coursePhasesSlice'

export const createCoursePhaseCheck = createAsyncThunk(
  'coursePhases/createCoursePhaseCheck',

  async (
    {
      coursePhaseId,
      coursePhaseCheck,
    }: {
      coursePhaseId: string
      coursePhaseCheck: CoursePhaseCheck
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/course-phases/${coursePhaseId}/course-phase-checks`,
          coursePhaseCheck,
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
