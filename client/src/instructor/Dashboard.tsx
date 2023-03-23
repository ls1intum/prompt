import { AppShell } from '@mantine/core'
import React, { useState, useEffect } from 'react'
import { NavigationBar } from '../utilities/NavigationBar/NavigationBar'
import { SignIn } from './SignIn/SignIn'

interface DashboardProps {
  child: React.ReactNode
}

export const Dashboard = ({ child }: DashboardProps): JSX.Element => {
  const [authenticated, setAuthenticated] = useState(false)

  useEffect(() => {
    if (localStorage.getItem('jwt_token')) {
      setAuthenticated(true)
    }
  }, [localStorage.getItem('jwt_token')])

  return (
    <>
      {authenticated ? (
        <div>
          <AppShell padding='md' navbar={<NavigationBar />}>
            {child}
          </AppShell>
        </div>
      ) : (
        <SignIn />
      )}
    </>
  )
}
