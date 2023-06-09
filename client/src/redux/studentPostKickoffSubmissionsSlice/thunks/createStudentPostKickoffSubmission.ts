import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type StudentPostKickoffSubmission } from '../studentPostKickoffSubmissionsSlice'

export const createStudentPostKickoffSubmission = createAsyncThunk(
  'studentPostKickoffSubmissions/createStudentPostKickoffSubmission',

  async (
    {
      studentId,
      studentPostKickoffSubmission,
    }: {
      studentId: string
      studentPostKickoffSubmission: StudentPostKickoffSubmission
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/post-kickoff-submissions/${studentId}`,
          studentPostKickoffSubmission,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
