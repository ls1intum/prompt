import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const assignDeveloperApplicationToProjectTeam = createAsyncThunk(
  'studentApplications/assignDeveloperApplicationToProjectTeam',

  async (
    {
      studentApplicationId,
      projectTeamId,
      courseIteration,
    }: {
      studentApplicationId: string
      projectTeamId: string
      courseIteration: string
    },
    { rejectWithValue },
  ) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/applications/${studentApplicationId}/project-team/${projectTeamId}?courseIteration=${courseIteration}`,
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
