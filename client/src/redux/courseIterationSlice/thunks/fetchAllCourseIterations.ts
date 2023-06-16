import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'

export const fetchAllCourseIterations = createAsyncThunk(
  'courseIterations/fetchAllCourseIterations',

  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get(`${serverBaseUrl}/api/course-iterations`, {})).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const fetchCourseIterationsWithOpenApplicationPeriod = createAsyncThunk(
  'courseIterations/fetchCourseIterationsWithOpenApplicationPeriod',

  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get(`${serverBaseUrl}/api/course-iterations/open`)).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
