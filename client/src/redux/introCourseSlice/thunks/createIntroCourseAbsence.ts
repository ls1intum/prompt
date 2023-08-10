import axios, { type AxiosError } from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type IntroCourseAbsence } from '../introCourseSlice'
import { notifications } from '@mantine/notifications'

export const createIntroCourseAbsence = createAsyncThunk(
  'introCourse/createIntroCourseAbsence',

  async (
    {
      introCourseParticipationId,
      introCourseAbsence,
    }: { introCourseParticipationId: string; introCourseAbsence: IntroCourseAbsence },
    { rejectWithValue },
  ) => {
    try {
      const response = await axios.post(
        `${serverBaseUrl}/api/intro-course/${introCourseParticipationId}/absences`,
        introCourseAbsence,
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
          message: `Intro course absence for student ${
            (response.data.student.firstName as string) ?? ''
          } ${(response.data.student.lastName as string) ?? ''} was successfully logged!`,
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
          message: `Failed to log an intro course absence.`,
        })
      }

      rejectWithValue(err)
    }
  },
)
