import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const toggleSkill = createAsyncThunk(
  'skills/toggleSkill',

  async (skillId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/skills/${skillId}`,
          {},
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
            },
          },
        )
      ).data
    } catch (err) {
      return rejectWithValue(err)
    }
  },
)
