import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type SeatPlanAssignment } from '../introCourseSlice'

export const createSeatPlanAssignments = createAsyncThunk(
  'introCourse/createSeatPlanAssignments',

  async (seatPlanAssignments: SeatPlanAssignment[], { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/intro-course/seat-plan-assignments`,
          seatPlanAssignments,
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
