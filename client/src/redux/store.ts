import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useSelector } from 'react-redux'
import authReducer from './authSlice/authSlice'
import applicationSemesterReducer from './applicationSemesterSlice/applicationSemesterSlice'
import studentApplicationsReducer from './studentApplicationSlice/studentApplicationSlice'
import projectTeamsReducer from './projectTeamsSlice/projectTeamsSlice'
import studentProjectTeamPreferencesSubmissionsReducer from './studentProjectTeamPreferencesSlice/studentProjectTeamPreferencesSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    applicationSemester: applicationSemesterReducer,
    studentApplications: studentApplicationsReducer,
    projectTeams: projectTeamsReducer,
    studentProjectTeamPreferencesSubmissions: studentProjectTeamPreferencesSubmissionsReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
