import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const rejectThesisApplication = createAsyncThunk(
  'thesisApplications/rejectThesisApplication',

  async (thesisApplicationId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${serverBaseUrl}/api/thesis-applications/${thesisApplicationId}/reject`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          },
        },
      )

      if (response) {
        notifications.show({
          color: 'green',
          autoClose: 5000,
          title: 'Success',
          message: `Sent a rejection mail successfully.`,
        })
      }

      return response.data
    } catch (err) {
      notifications.show({
        color: 'red',
        autoClose: 5000,
        title: 'Error',
        message: `Failed to send a rejection mail.`,
      })
      return rejectWithValue(err)
    }
  },
)
