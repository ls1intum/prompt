import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { type ProjectTeam } from '../projectTeamsSlice'

export const createProjectTeam = createAsyncThunk(
  'projectTeams/createProjectTeam',

  async ({
    projectTeam,
    applicationSemester,
  }: {
    projectTeam: ProjectTeam
    applicationSemester: string
  }) => {
    try {
      return (
        await axios.post(
          `http://localhost:8080/api/project-teams?applicationSemester=${applicationSemester}`,
          projectTeam,
          {
            headers: {
              Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
            },
          },
        )
      ).data
    } catch (err) {
      console.log(err)
      return undefined
    }
  },
)
