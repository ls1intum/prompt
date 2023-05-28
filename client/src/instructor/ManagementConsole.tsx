import { AppShell, Center, Loader } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { type AppDispatch, useAppSelector } from '../redux/store'
import { NavigationBar } from '../utilities/NavigationBar/NavigationBar'
import { WorkspaceSelectionDialog } from './ApplicationSemesterManager/WorkspaceSelectionDialog'
import { useDispatch } from 'react-redux'
import { fetchAllApplicationSemesters } from '../redux/applicationSemesterSlice/thunks/fetchApplicationSemesters'
import Keycloak from 'keycloak-js'
import jwtDecode from 'jwt-decode'
import { setAuthState } from '../redux/authSlice/authSlice'
import { setCurrentState } from '../redux/applicationSemesterSlice/applicationSemesterSlice'
import { keycloakUrl } from '../service/configService'

interface DashboardProps {
  child: React.ReactNode
}

export const ManagementConsole = ({ child }: DashboardProps): JSX.Element => {
  const keycloak = new Keycloak({
    realm: 'prompt',
    url: keycloakUrl,
    clientId: 'prompt-client',
  })
  const [keycloakValue, setKeycloakValue] = useState<Keycloak>(keycloak)
  const [authenticated, setAuthenticated] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { currentState, applicationSemesters } = useAppSelector(
    (state) => state.applicationSemester,
  )

  useEffect(() => {
    void keycloak
      .init({ onLoad: 'login-required' })
      .then((authenticated) => {
        if (authenticated) {
          setAuthenticated(true)
        } else {
          setAuthenticated(false)
          void keycloak.login()
        }
        localStorage.setItem('jwt_token', keycloak.token ?? '')
        localStorage.setItem('refreshToken', keycloak.refreshToken ?? '')
        try {
          if (keycloak.token) {
            const decodedJwt = jwtDecode<{
              given_name: string
              family_name: string
              email: string
              preferred_username: string
            }>(keycloak.token)
            dispatch(
              setAuthState({
                firstName: decodedJwt.given_name,
                lastName: decodedJwt.family_name,
                email: decodedJwt.email,
                username: decodedJwt.preferred_username,
              }),
            )
          }
        } catch (error) {
          dispatch(
            setAuthState({
              firstName: '',
              lastName: '',
              email: '',
              username: '',
              error,
            }),
          )
        }
        setKeycloakValue(keycloak)
      })
      .catch((err) => {
        alert(err)
      })
  }, [])

  useEffect(() => {
    if (authenticated && !currentState && localStorage.getItem('application-semester')) {
      void dispatch(fetchAllApplicationSemesters())
    }
  }, [authenticated, currentState])

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
      {authenticated ? (
        <div>
          {currentState ? (
            <AppShell navbar={<NavigationBar keycloak={keycloakValue} />}>
              {authenticated && <div style={{ margin: '5vh 2vw' }}>{child}</div>}
            </AppShell>
          ) : (
            <WorkspaceSelectionDialog />
          )}
        </div>
      ) : (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            height: '100vh',
          }}
        >
          <Center>
            <Loader />
          </Center>
        </div>
      )}
    </>
  )
}
