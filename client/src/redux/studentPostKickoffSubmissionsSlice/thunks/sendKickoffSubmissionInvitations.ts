import axios from 'axios'
import { createAsyncThunk } from '@reduxjs/toolkit'
import { serverBaseUrl } from '../../../service/configService'

export const sendKickoffSubmissionInvitations = createAsyncThunk(
  'postKickoffSubmissions/sendKickoffSubmissionInvitations',

  async (courseIteration: string, { rejectWithValue }) => {
    try {
      return (
        await axios.post(
          `${serverBaseUrl}/api/post-kickoff-submissions/invitations?courseIteration=${courseIteration}`,
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
