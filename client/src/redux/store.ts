import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useSelector } from 'react-redux'
import studentPostKickoffSubmissionsReducer from './studentPostKickoffSubmissionsSlice/studentPostKickoffSubmissionsSlice'
import introCourseReducer from './introCourseSlice/introCourseSlice'

const store = configureStore({
  reducer: {
    studentPostKickoffSubmissions: studentPostKickoffSubmissionsReducer,
    introCourse: introCourseReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
