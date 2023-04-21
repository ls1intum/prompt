import { AppShell } from '@mantine/core'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { type AppDispatch, useAppSelector } from '../redux/store'
import { NavigationBar } from '../utilities/NavigationBar/NavigationBar'
import { WorkspaceSelectionDialog } from './ApplicationSemesterManager/WorkspaceSelectionDialog'
import { useDispatch } from 'react-redux'
import { fetchAllApplicationSemesters } from '../redux/applicationSemesterSlice/thunks/fetchApplicationSemesters'
import { setCurrentState } from '../redux/applicationSemesterSlice/applicationSemesterSlice'

interface DashboardProps {
  child: React.ReactNode
}

export const Dashboard = ({ child }: DashboardProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
  const { currentState, applicationSemesters } = useAppSelector(
    (state) => state.applicationSemester,
  )

  useEffect(() => {
    if (!localStorage.getItem('jwt_token')) {
      navigate('/management/signin')
    }
  }, [localStorage.getItem('jwt_token')])

  useEffect(() => {
    if (!currentState && localStorage.getItem('application-semester')) {
      void dispatch(fetchAllApplicationSemesters())
    }
  }, [currentState])

  useEffect(() => {
    if (
      !currentState &&
      applicationSemesters.length > 0 &&
      localStorage.getItem('application-semester')
    ) {
      const savedApplicationSemester = applicationSemesters.find(
        (as) => as.id === localStorage.getItem('application-semester'),
      )
      if (savedApplicationSemester) {
        void dispatch(setCurrentState(savedApplicationSemester))
      }
    }
  }, [currentState, applicationSemesters])

  return (
    <>
      {currentState ? (
        <AppShell padding='md' navbar={<NavigationBar />}>
          <div style={{ margin: '5vh 4vw' }}>{child}</div>
        </AppShell>
      ) : (
        <WorkspaceSelectionDialog />
      )}
    </>
  )
}
