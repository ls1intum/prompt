import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const rejectThesisApplication = createAsyncThunk(
  'thesisApplications/rejectThesisApplication',

  async (thesisApplicationId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/thesis-applications/${thesisApplicationId}/reject`,
        {},
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
