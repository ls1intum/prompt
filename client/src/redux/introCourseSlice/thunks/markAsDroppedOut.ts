import axios, { type AxiosError } from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const markDroppedOut = createAsyncThunk(
  'introCourse/markNotDroppedOut',

  async (introCourseParticipationId: string, { rejectWithValue }) => {
    try {
      const response = await axios.post(
        `${serverBaseUrl}/api/intro-course/${introCourseParticipationId}/dropped-out`,
        {},
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
          message: `Status ${(response.data.student.firstName as string) ?? ''} ${
            (response.data.student.lastName as string) ?? ''
          } was successfully logged!`,
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
          message: `Failed to set a status.`,
        })
      }

      rejectWithValue(err)
    }
  },
)

export const unmarkDroppedOut = createAsyncThunk(
  'introCourse/unmarkNotDroppedOut',

  async (introCourseParticipationId: string, { rejectWithValue }) => {
    try {
      const response = await axios.delete(
        `${serverBaseUrl}/api/intro-course/${introCourseParticipationId}/dropped-out`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          },
        },
      )

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
          message: `Failed to set a status.`,
        })
      }

      rejectWithValue(err)
    }
  },
)
