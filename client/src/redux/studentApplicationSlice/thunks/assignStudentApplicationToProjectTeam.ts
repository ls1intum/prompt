import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'

export const assignStudentApplicationToProjectTeam = createAsyncThunk(
  'studentApplications/assignStudentApplicationToProjectTeam',

  async ({
    studentApplicationId,
    projectTeamId,
    applicationSemester,
  }: {
    studentApplicationId: string
    projectTeamId: string
    applicationSemester: string
  }) => {
    try {
      return (
        await axios.post(
          `http://localhost:8080/api/student-applications/${studentApplicationId}/project-team/${projectTeamId}?applicationSemester=${applicationSemester}`,
          {},
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
