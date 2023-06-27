import { AppShell, Card, Center, Loader, Title, Text } from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { type AppDispatch, useAppSelector } from '../redux/store'
import { NavigationBar } from '../utilities/NavigationBar/NavigationBar'
import { WorkspaceSelectionDialog } from './CourseIterationManager/components/CourseIterationManager/WorkspaceSelectionDialog'
import { useDispatch } from 'react-redux'
import { fetchAllCourseIterations } from '../redux/courseIterationSlice/thunks/fetchAllCourseIterations'
import Keycloak from 'keycloak-js'
import jwtDecode from 'jwt-decode'
import { setAuthState } from '../redux/authSlice/authSlice'
import { setCurrentState } from '../redux/courseIterationSlice/courseIterationSlice'
import { keycloakRealmName, keycloakUrl } from '../service/configService'

const AccessRestricted = (): JSX.Element => {
  return (
    <div
      style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}
    >
      <Card withBorder p='xl'>
        <Title order={5}>Restricted acccess!</Title>
        <Text c='dimmed'>You do not have the necessary permissions to access this resource..</Text>
      </Card>
    </div>
  )
}

interface DashboardProps {
  child: React.ReactNode
}

export const ManagementConsole = ({ child }: DashboardProps): JSX.Element => {
  const mgmtAccess = useAppSelector((state) => state.auth.mgmtAccess)
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
                mgmtAccess: keycloak.hasResourceRole('ipraktikum-pm', 'prompt-server'),
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
              mgmtAccess: false,
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
      const savedCourseIteration = courseIterations.find(
        (as) => as.id === localStorage.getItem('course-iteration'),
      )
      if (savedCourseIteration) {
        void dispatch(setCurrentState(savedCourseIteration))
      }
    }
  }, [currentState, courseIterations])

  useEffect(() => {
    if (authenticated && !mgmtAccess) {
      void keycloakValue.logout()
    }
  }, [authenticated, mgmtAccess])

  return (
    <>
      {authenticated && mgmtAccess ? (
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
          <Center>{authenticated && !mgmtAccess ? <AccessRestricted /> : <Loader />}</Center>
        </div>
      )}
    </>
  )
}
