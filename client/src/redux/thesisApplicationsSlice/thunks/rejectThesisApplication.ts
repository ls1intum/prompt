import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const rejectThesisApplication = createAsyncThunk(
  'thesisApplications/rejectThesisApplication',

  async (
    { thesisApplicationId, notifyStudent }: { thesisApplicationId: string; notifyStudent: boolean },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.post(
        `/api/thesis-applications/${thesisApplicationId}/reject`,
        {},
        {
          params: {
            notifyStudent,
          },
        },
      )

      if (response) {
        notifications.show({
          color: 'green',
          autoClose: 5000,
          title: 'Success',
          message: notifyStudent
            ? `Sent a rejection mail successfully.`
            : 'Application status updated successfully',
        })
      }

      return response.data
    } catch (err) {
      notifications.show({
        color: 'red',
        autoClose: 5000,
        title: 'Error',
        message: notifyStudent
          ? `Failed to send a rejection mail.`
          : 'Failed to update application status',
      })
      return rejectWithValue(err)
    }
  },
)
