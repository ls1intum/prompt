import { type PayloadAction, createSlice } from '@reduxjs/toolkit'

interface AuthSliceState {
  firstName: string
  lastName: string
  email: string
  username: string
  error?: any
}

const initialState: AuthSliceState = {
  firstName: '',
  lastName: '',
  email: '',
  username: '',
}

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setAuthState: (state, action: PayloadAction<AuthSliceState>) => {
      state.firstName = action.payload.firstName
      state.lastName = action.payload.lastName
      state.email = action.payload.email
      state.username = action.payload.username
    },
  },
})

export const { setAuthState } = authSlice.actions
export default authSlice.reducer
