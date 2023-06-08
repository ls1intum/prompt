import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'
import { type Skill } from '../skillsSlice'

export const fetchSkills = createAsyncThunk<Skill[]>('skills/fetchSkills', async () => {
  try {
    return (await axios.get(`${serverBaseUrl}/api/skills`)).data
  } catch (err) {}
})
