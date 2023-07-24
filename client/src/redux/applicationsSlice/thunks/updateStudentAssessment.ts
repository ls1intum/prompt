import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type Patch, serverBaseUrl } from '../../../service/configService'

export const updateStudentAssessment = createAsyncThunk(
  'applications/updateStudentAssessment',

  async (
    {
      studentId,
      studentAssessmentPatch,
    }: {
      studentId: string
      studentAssessmentPatch: Patch[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(
          `${serverBaseUrl}/api/applications/students/${studentId}/assessment`,
          studentAssessmentPatch,
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
