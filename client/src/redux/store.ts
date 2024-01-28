import { configureStore } from '@reduxjs/toolkit'
import { type TypedUseSelectorHook, useSelector } from 'react-redux'
import authReducer from './authSlice/authSlice'
import courseIterationReducer from './courseIterationSlice/courseIterationSlice'
import applicationsReducer from './applicationsSlice/applicationsSlice'
import thesisApplicationsReducer from './thesisApplicationsSlice/thesisApplicationsSlice'
import projectTeamsReducer from './projectTeamsSlice/projectTeamsSlice'
import studentPostKickoffSubmissionsReducer from './studentPostKickoffSubmissionsSlice/studentPostKickoffSubmissionsSlice'
import introCourseReducer from './introCourseSlice/introCourseSlice'
import coursePhasesReducer from './coursePhasesSlice/coursePhasesSlice'

const store = configureStore({
  reducer: {
    auth: authReducer,
    courseIterations: courseIterationReducer,
    coursePhases: coursePhasesReducer,
    applications: applicationsReducer,
    thesisApplications: thesisApplicationsReducer,
    projectTeams: projectTeamsReducer,
    studentPostKickoffSubmissions: studentPostKickoffSubmissionsReducer,
    introCourse: introCourseReducer,
  },
})

export default store

export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
