import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const deleteIntroCourseAbsence = createAsyncThunk(
  'introCourse/deleteIntroCourseAbsence',

  async (
    {
      introCourseParticipationId,
      introCourseAbsenceId,
    }: { introCourseParticipationId: string; introCourseAbsenceId: string },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.delete(
          `${serverBaseUrl}/api/intro-course/${introCourseParticipationId}/absences/${introCourseAbsenceId}`,
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
