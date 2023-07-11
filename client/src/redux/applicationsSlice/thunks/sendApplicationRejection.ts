import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const sendCoachApplicationRejection = createAsyncThunk(
  'applications/sendCoachApplicationRejection',

  async (applicationId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/coach/${applicationId}/rejection`,
          {},
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
        message: `Failed to send an application rejection.`,
      })

      rejectWithValue(err)
    }
  },
)

export const sendTutorApplicationRejection = createAsyncThunk(
  'applications/sendTutorApplicationRejection',

  async (applicationId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/tutor/${applicationId}/rejection`,
          {},
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
        message: `Failed to send an application rejection.`,
      })

      rejectWithValue(err)
    }
  },
)
