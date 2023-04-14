import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type ApplicationSemesterRequest } from '../applicationSemesterSlice'

export const createApplicationSemester = createAsyncThunk(
  'applicationSemesters/createApplicationSemester',

  async (applicationSemester: ApplicationSemesterRequest) => {
    try {
      return (
        await axios.post('http://localhost:8080/api/application-semesters', applicationSemester, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          },
        })
      ).data
    } catch (err) {
      console.log(err)
      return undefined
    }
  },
)
