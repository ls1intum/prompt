import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const fetchAllApplicationSemesters = createAsyncThunk(
  'applicationSemesters/fetchAllApplicationSemesters',

  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get(`${serverBaseUrl}/api/application-semesters`, {})).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const fetchApplicationSemestersWithOpenApplicationPeriod = createAsyncThunk(
  'applicationSemesters/fetchApplicationSemestersWithOpenApplicationPeriod',

  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get(`${serverBaseUrl}/api/application-semesters/open`)).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
