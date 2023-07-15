import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const sendCoachApplicationAcceptance = createAsyncThunk(
  'applications/sendCoachApplicationAcceptance',

  async (applicationId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/coach/${applicationId}/acceptance`,
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
        message: `Failed to send an application acceptance.`,
      })

      rejectWithValue(err)
    }
  },
)

export const sendTutorApplicationAcceptance = createAsyncThunk(
  'applications/sendTutorApplicationAcceptance',

  async (applicationId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/tutor/${applicationId}/acceptance`,
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
        message: `Failed to send an application acceptance.`,
      })

      rejectWithValue(err)
    }
  },
)
