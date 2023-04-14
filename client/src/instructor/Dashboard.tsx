import { AppShell } from '@mantine/core'
import React, { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppSelector } from '../redux/store'
import { NavigationBar } from '../utilities/NavigationBar/NavigationBar'
import { WorkspaceSelectionDialog } from './WorkspaceSelectionDialog'

interface DashboardProps {
  child: React.ReactNode
}

export const Dashboard = ({ child }: DashboardProps): JSX.Element => {
  const navigate = useNavigate()
  const currentState = useAppSelector((state) => state.applicationSemester.currentState)

  useEffect(() => {
    if (!localStorage.getItem('jwt_token')) {
      navigate('/management/signin')
    }
  }, [localStorage.getItem('jwt_token')])

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
