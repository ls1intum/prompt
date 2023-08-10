import axios, { type AxiosError } from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type Seat } from '../introCourseSlice'
import { notifications } from '@mantine/notifications'

export const createSeatPlan = createAsyncThunk(
  'introCourse/createSeatPlan',

  async (
    { courseIterationId, seatPlan }: { courseIterationId: string; seatPlan: Seat[] },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${serverBaseUrl}/api/intro-course/${courseIterationId}/seat-plan`,
        seatPlan,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          },
        },
      )
      if (response.status >= 200 && response.status < 300) {
        notifications.show({
          color: 'green',
          autoClose: 5000,
          title: 'Success',
          message: `Seats have been successfully assigned to students!`,
        })
      }
      return response.data
    } catch (err) {
      if ((err as AxiosError)?.response?.status === 400) {
        notifications.show({
          color: 'red',
          autoClose: 10000,
          title: 'Error',
          message: `${((err as AxiosError)?.response?.data as string) ?? ''}`,
        })
      } else {
        notifications.show({
          color: 'red',
          autoClose: 10000,
          title: 'Error',
          message: `Failed to create a seat plan. Server responded with ${err as string}`,
        })
      }

      rejectWithValue(err)
    }
  },
)
