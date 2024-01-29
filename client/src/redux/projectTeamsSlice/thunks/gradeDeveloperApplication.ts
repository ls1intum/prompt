import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance, serverBaseUrl } from '../../../service/configService'
import { notifications } from '@mantine/notifications'
import { Grade } from '../../../interface/application'

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
      const response = await axiosInstance.post(
        `${serverBaseUrl}/api/applications/developer/${applicationId}/grading`,
        grade,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
            'Content-Type': 'application/json-path+json',
          },
        },
      )
      notifications.show({
        color: 'green',
        autoClose: 10000,
        title: 'Success',
        message: `Grade has been assigned successfully.`,
      })
      return response.data
    } catch (err) {
      notifications.show({
        color: 'red',
        autoClose: 10000,
        title: 'Error',
        message: `Could not assign a grade.`,
      })
      return rejectWithValue(err)
    }
  },
)
