import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type Patch, serverBaseUrl } from '../../../service/configService'

export const updateStudent = createAsyncThunk(
  'applications/updateStudent',

  async (
    {
      studentId,
      studentPatch,
    }: {
      studentId: string
      studentPatch: Patch[]
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.patch(`${serverBaseUrl}/api/students/${studentId}`, studentPatch, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
            'Content-Type': 'application/json-path+json',
          },
        })
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
