import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance, serverBaseUrl } from '../../../service/configService'
import { type Grade } from '../../applicationsSlice/applicationsSlice'

export const gradeDeveloperApplication = createAsyncThunk(
  'projectTeams/gradeDeveloperApplication',

  async (
    {
      applicationId,
      grade,
    }: {
      applicationId: string
      grade: Partial<Grade>
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axiosInstance.post(
          `${serverBaseUrl}/api/applications/developer/${applicationId}/grading`,
          grade,
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
