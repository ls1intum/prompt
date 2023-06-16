import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type CoursePhaseCheck } from '../coursePhasesSlice'

export const updateCoursePhaseCheckOrdering = createAsyncThunk(
  'coursePhases/updateCoursePhaseCheckOrdering',

  async (
    {
      coursePhaseId,
      coursePhaseChecks,
    }: {
      coursePhaseId: string
      coursePhaseChecks: CoursePhaseCheck[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(
          `${serverBaseUrl}/api/course-phases/${coursePhaseId}/course-phase-checks`,
          coursePhaseChecks,
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
