import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type Patch, serverBaseUrl } from '../../../service/configService'

export const updateCourseIteration = createAsyncThunk(
  'courseIterations/updateCourseIteration',

  async (
    {
      courseIterationId,
      courseIterationPatch,
    }: {
      courseIterationId: string
      courseIterationPatch: Patch[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(
          `${serverBaseUrl}/api/course-iterations/${courseIterationId}`,
          courseIterationPatch,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
              'Content-Type': 'application/json-path+json',
            },
          },
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
