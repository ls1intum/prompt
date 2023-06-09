import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type Patch, serverBaseUrl } from '../../../service/configService'

export const updateStudentApplicationAssessment = createAsyncThunk(
  'studentApplications/updateStudentApplicationAssessment',

  async (
    {
      studentApplicationId,
      studentApplicationAssessmentPatch,
    }: {
      studentApplicationId: string
      studentApplicationAssessmentPatch: Patch[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(
          `${serverBaseUrl}/api/student-applications/${studentApplicationId}/assessment`,
          studentApplicationAssessmentPatch,
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
