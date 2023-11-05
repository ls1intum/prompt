import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const acceptThesisApplication = createAsyncThunk(
  'thesisApplications/acceptThesisApplication',

  async (thesisApplicationId: string, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post(
        `/api/thesis-applications/${thesisApplicationId}/accept`,
        {},
      )

      if (response) {
        notifications.show({
          color: 'green',
          autoClose: 5000,
          title: 'Success',
          message: `Sent an acceptance mail successfully.`,
        })
      }

      return response.data
    } catch (err) {
      notifications.show({
        color: 'red',
        autoClose: 5000,
        title: 'Error',
        message: `Failed to send an acceptance mail.`,
      })
      return rejectWithValue(err)
    }
  },
)
