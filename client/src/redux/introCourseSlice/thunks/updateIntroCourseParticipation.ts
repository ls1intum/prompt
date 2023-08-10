import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type Patch, serverBaseUrl } from '../../../service/configService'

export const updateIntroCourseParticipation = createAsyncThunk(
  'introCourse/updateIntroCourseParticipation',

  async (
    {
      introCourseParticipationId,
      introCourseParticipationPatch,
    }: {
      introCourseParticipationId: string
      introCourseParticipationPatch: Patch[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(
          `${serverBaseUrl}/api/intro-course/${introCourseParticipationId}`,
          introCourseParticipationPatch,
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
