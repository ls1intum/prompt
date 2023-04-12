import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import moment from 'moment'

export const fetchAllApplicationSemesters = createAsyncThunk(
  'applicationSemesters/fetchAllApplicationSemesters',

  async () => {
    try {
      return (
        await axios.get('http://localhost:8080/api/application-semesters', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          },
        })
      ).data
    } catch (err) {
      console.log(err)
      return []
    }
  },
)

export const fetchApplicationSemestersWithOpenApplicationPeriod = createAsyncThunk(
  'applicationSemesters/fetchApplicationSemestersWithOpenApplicationPeriod',

  async () => {
    try {
      const today = moment(new Date(), "yyyy-MM-dd'T'HH:mm:ssXXX").format()
      const response = (
        await axios.get(
          `http://localhost:8080/api/application-semesters?applicationPeriodDate=${encodeURIComponent(
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
      console.log(err)
      return []
    }
  },
)
