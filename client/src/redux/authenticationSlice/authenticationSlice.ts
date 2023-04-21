import { createSlice } from '@reduxjs/toolkit'
import { refreshToken } from './thunks/refreshToken'
import { signIn } from './thunks/signIn'
import { signUp } from './thunks/signUp'

interface SignInRequest {
  username: string
  password: string
}

interface SignInResponse {
  id: string
  username: string
  email: string
  roles: string[]
  accessToken: string
  refreshToken: string
}

interface SignUpRequest {
  firstName: string
  lastName: string
  email: string
  username: string
  password: string
  roles: string[]
}

interface SignUpResponse {
  message: string
}

interface AuthenticationSliceState {
  status: string
  error: string | null
  user: SignInResponse | null
}

const initialState: AuthenticationSliceState = {
  status: 'idle',
  error: null,
  user: null,
}

export const authenticationState = createSlice({
  name: 'authentication',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(signIn.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(signIn.fulfilled, (state, { payload }) => {
      state.user = payload
      localStorage.setItem('refreshToken', payload.refreshToken)
      localStorage.setItem('jwt_token', payload.accessToken)
      localStorage.setItem('user_id', payload.id)
      state.status = 'idle'
    })

    builder.addCase(signIn.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('refreshToken')
    })

    builder.addCase(refreshToken.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(refreshToken.fulfilled, (state, { payload }) => {
      localStorage.setItem('refresh_token', payload.refreshToken)
      localStorage.setItem('jwt_token', payload.accessToken)
      state.status = 'idle'
    })

    builder.addCase(refreshToken.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
      localStorage.removeItem('jwt_token')
      localStorage.removeItem('refresh_token')
    })

    builder.addCase(signUp.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(signUp.fulfilled, (state) => {
      state.status = 'idle'
    })

    builder.addCase(signUp.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

// export const {  } = authenticationState.actions
export default authenticationState.reducer
export { type SignInRequest, type SignInResponse, type SignUpRequest, type SignUpResponse }
