import { createAsyncThunk } from '@reduxjs/toolkit'
import axios from 'axios'
import { serverBaseUrl } from '../../../service/configService'
import { notifications } from '@mantine/notifications'

export const fetchProjectTeamDevelopers = createAsyncThunk(
  'projectTeams/fetchProjectTeamDevelopers',

  async (projectTeamId: string, { rejectWithValue }) => {
    try {
      return (
        await axios.get(`${serverBaseUrl}/api/project-teams/${projectTeamId}/developers`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
            'Content-Type': 'application/json-path+json',
          },
        })
      ).data
    } catch (err) {
      notifications.show({
        color: 'red',
        autoClose: 10000,
        title: 'Error',
        message: `Could not fetch developer application for the project team.`,
      })
      return rejectWithValue(err)
    }
  },
)
