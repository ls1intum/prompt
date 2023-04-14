import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type StudentApplication } from '../studentApplicationSlice'

export const createStudentApplication = createAsyncThunk(
  'studentApplications/createStudentApplication',

  async (studentApplication: StudentApplication) => {
    try {
      return (
        await axios.post('http://localhost:8080/api/student-applications', studentApplication)
      ).data
    } catch (err) {
      console.log(err)
      return undefined
    }
  },
)
