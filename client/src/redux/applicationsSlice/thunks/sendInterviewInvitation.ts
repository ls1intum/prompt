import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const sendCoachInterviewInvitation = createAsyncThunk(
  'applications/sendCoachInterviewInvitation',

  async (applicationId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/coach/${applicationId}/interview-invitations`,
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
        message: `Failed to send an interview invitation.`,
      })

      rejectWithValue(err)
    }
  },
)

export const sendTutorInterviewInvitation = createAsyncThunk(
  'applications/sendTutorInterviewInvitation',

  async (applicationId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/tutor/${applicationId}/interview-invitations`,
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
        message: `Failed to send an interview invitation.`,
      })

      rejectWithValue(err)
    }
  },
)
