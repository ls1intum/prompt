import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type DeveloperApplication } from '../studentApplicationSlice'
import { serverBaseUrl } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const createDeveloperApplication = createAsyncThunk(
  'studentApplications/createDeveloperApplication',

  async (
    {
      application,
      courseIteration,
    }: {
      application: DeveloperApplication
      courseIteration: string
    },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${serverBaseUrl}/api/applications/developer?courseIteration=${courseIteration}`,
        application,
      )
      if (response.status >= 200 && response.status < 300) {
        notifications.show({
          color: 'green',
          autoClose: 5000,
          title: 'Success',
          message: `Your application was successfully submitted!`,
        })
      }
      return response.data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
