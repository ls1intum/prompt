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

export const fetchCourseIterationsWithOpenKickOffPeriod = createAsyncThunk(
  'courseIterations/fetchCourseIterationsWithOpenKickOffPeriod',

  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get(`${serverBaseUrl}/api/course-iterations/open/kick-off`)).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const fetchCourseIterationsWithOpenDeveloperApplicationPeriod = createAsyncThunk(
  'courseIterations/fetchCourseIterationsWithOpenDeveloperApplicationPeriod',

  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get(`${serverBaseUrl}/api/course-iterations/open/developer`)).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const fetchCourseIterationsWithOpenCoachApplicationPeriod = createAsyncThunk(
  'courseIterations/fetchCourseIterationsWithOpenCoachApplicationPeriod',

  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get(`${serverBaseUrl}/api/course-iterations/open/coach`)).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const fetchCourseIterationsWithOpenTutorApplicationPeriod = createAsyncThunk(
  'courseIterations/fetchCourseIterationsWithOpenTutorApplicationPeriod',

  async (_, { rejectWithValue }) => {
    try {
      return (await axios.get(`${serverBaseUrl}/api/course-iterations/open/tutor`)).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
