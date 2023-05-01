import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import moment from 'moment'
import { serverBaseUrl } from '../../../service/configService'

export const fetchAllApplicationSemesters = createAsyncThunk(
  'applicationSemesters/fetchAllApplicationSemesters',

  async (_, { rejectWithValue }) => {
    try {
      return (
        await axios.get(`${serverBaseUrl}/api/application-semesters`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          },
        })
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const fetchApplicationSemestersWithOpenApplicationPeriod = createAsyncThunk(
  'applicationSemesters/fetchApplicationSemestersWithOpenApplicationPeriod',

  async (_, { rejectWithValue }) => {
    try {
      const today = moment(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX").format()
      const response = (
        await axios.get(
          `${serverBaseUrl}/api/application-semesters?applicationPeriodDate=${encodeURIComponent(
            today,
          )}`,
        )
      ).data
      if (response) {
        return response[0]
      } else {
        return undefined
      }
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
