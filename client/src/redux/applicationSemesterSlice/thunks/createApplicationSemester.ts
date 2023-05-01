import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type ApplicationSemesterRequest } from '../applicationSemesterSlice'
import { serverBaseUrl } from '../../../service/configService'

export const createApplicationSemester = createAsyncThunk(
  'applicationSemesters/createApplicationSemester',

  async (applicationSemester: ApplicationSemesterRequest, { rejectWithValue }) => {
    try {
      return (
        await axios.post(`${serverBaseUrl}/api/application-semesters`, applicationSemester, {
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
