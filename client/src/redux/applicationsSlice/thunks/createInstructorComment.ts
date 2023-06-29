import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type InstructorComment } from '../applicationsSlice'
import { serverBaseUrl } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const createInstructorCommentForDeveloperApplication = createAsyncThunk(
  'applications/createInstructorCommentForDeveloperApplication',

  async (
    {
      applicationId,
      instructorComment,
    }: {
      applicationId: string
      instructorComment: InstructorComment
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/developer/${applicationId}/instructor-comments`,
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

export const createInstructorCommentForCoachApplication = createAsyncThunk(
  'applications/createInstructorCommentForCoachApplication',

  async (
    {
      applicationId,
      instructorComment,
    }: {
      applicationId: string
      instructorComment: InstructorComment
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/coach/${applicationId}/instructor-comments`,
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

export const createInstructorCommentForTutorApplication = createAsyncThunk(
  'applications/createInstructorCommentForTutorApplication',

  async (
    {
      applicationId,
      instructorComment,
    }: {
      applicationId: string
      instructorComment: InstructorComment
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/tutor/${applicationId}/instructor-comments`,
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
