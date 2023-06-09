import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type InstructorComment } from '../studentApplicationSlice'
import { serverBaseUrl } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const createInstructorComment = createAsyncThunk(
  'studentApplications/createInstructorComment',

  async (
    {
      studentApplicationId,
      instructorComment,
    }: {
      studentApplicationId: string
      instructorComment: InstructorComment
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/student-applications/${studentApplicationId}/instructor-comments`,
          instructorComment,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
            },
          },
        )
      ).data
    } catch (err) {
      notifications.show({
        color: 'red',
        autoClose: 5000,
        title: 'Error',
        message: `Failed to create an instructor comment. Server responded with ${err as string}`,
      })
      return rejectWithValue(err)
    }
  },
)
