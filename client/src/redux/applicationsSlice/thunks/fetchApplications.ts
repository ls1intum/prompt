import { createAsyncThunk } from '@reduxjs/toolkit'
import { axiosInstance } from '../../../service/configService'
import { type ApplicationStatus } from '../applicationsSlice'

export const fetchDeveloperApplications = createAsyncThunk(
  'applications/fetchDeveloperApplications',

  async (
    {
      courseIteration,
      status,
    }: { courseIteration: string; status?: keyof typeof ApplicationStatus },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axiosInstance.get(
          `/api/applications/developer?courseIteration=${courseIteration}${
            status ? `&applicationStatus=${status}` : ''
          }`,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const fetchCoachApplications = createAsyncThunk(
  'applications/fetchCoachApplications',

  async (
    {
      courseIteration,
      status,
    }: { courseIteration: string; status?: keyof typeof ApplicationStatus },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axiosInstance.get(
          `/api/applications/coach?courseIteration=${courseIteration}${
            status ? `&applicationStatus=${status}` : ''
          }`,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)

export const fetchTutorApplications = createAsyncThunk(
  'applications/fetchTutorApplications',

  async (
    {
      courseIteration,
      status,
    }: { courseIteration: string; status?: keyof typeof ApplicationStatus },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axiosInstance.get(
          `/api/applications/tutor?courseIteration=${courseIteration}${
            status ? `&applicationStatus=${status}` : ''
          }`,
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
