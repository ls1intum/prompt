import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useSelector } from 'react-redux'
import authenticationReducer from './authenticationSlice/authenticationSlice'
import applicationSemesterReducer from './applicationSemesterSlice/applicationSemesterSlice'
import studentApplicationsReducer from './studentApplicationSlice/studentApplicationSlice'
import projectTeamsReducer from './projectTeamsSlice/projectTeamsSlice'
import studentProjectTeamPreferencesSubmissionsReducer from './studentProjectTeamPreferencesSlice/studentProjectTeamPreferencesSlice'

const store = configureStore({
  reducer: {
    authentication: authenticationReducer,
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
