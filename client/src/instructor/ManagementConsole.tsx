import { AppShell, Center, Loader } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { type AppDispatch, useAppSelector } from '../redux/store'
import { NavigationBar } from '../utilities/NavigationBar/NavigationBar'
import { WorkspaceSelectionDialog } from './CourseIterationManager/WorkspaceSelectionDialog'
import { useDispatch } from 'react-redux'
import { fetchAllCourseIterations } from '../redux/courseIterationSlice/thunks/fetchAllCourseIterations'
import Keycloak from 'keycloak-js'
import jwtDecode from 'jwt-decode'
import { setAuthState } from '../redux/authSlice/authSlice'
import { setCurrentState } from '../redux/courseIterationSlice/courseIterationSlice'
import { keycloakRealmName, keycloakUrl } from '../service/configService'

interface DashboardProps {
  child: React.ReactNode
}

export const ManagementConsole = ({ child }: DashboardProps): JSX.Element => {
  const keycloak = new Keycloak({
    realm: keycloakRealmName,
    url: keycloakUrl,
    clientId: 'prompt-client',
  })
  const [keycloakValue, setKeycloakValue] = useState<Keycloak>(keycloak)
  const [authenticated, setAuthenticated] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { currentState, courseIterations } = useAppSelector((state) => state.courseIterations)

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
    if (authenticated && !currentState && localStorage.getItem('course-iteration')) {
      void dispatch(fetchAllCourseIterations())
    }
  }, [authenticated, currentState])

  useEffect(() => {
    if (!currentState && courseIterations.length > 0 && localStorage.getItem('course-iteration')) {
      const savedApplicationSemester = courseIterations.find(
        (as) => as.id === localStorage.getItem('course-iteration'),
      )
      if (savedApplicationSemester) {
        void dispatch(setCurrentState(savedApplicationSemester))
      }
    }
  }, [currentState, courseIterations])

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
