import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'
import { type Skill } from '../skillsSlice'

export const createSkill = createAsyncThunk(
  'skills/createSkill',

  async (skill: Skill, { rejectWithValue }) => {
    try {
      return (
        await axios.post(`${serverBaseUrl}/api/skills`, skill, {
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
