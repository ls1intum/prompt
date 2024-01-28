import {
  Card,
  Center,
  Loader,
  Title,
  Text,
  Group,
  Transition,
  Affix,
  Button,
  rem,
} from '@mantine/core'
import React, { useEffect, useState } from 'react'
import { type AppDispatch, useAppSelector } from '../redux/store'
import { WorkspaceSelectionDialog } from './CourseIterationManager/components/CourseIterationManager/WorkspaceSelectionDialog'
import { useDispatch } from 'react-redux'
import { fetchAllCourseIterations } from '../redux/courseIterationSlice/thunks/fetchAllCourseIterations'
import Keycloak from 'keycloak-js'
import { jwtDecode } from 'jwt-decode'
import { setAuthState } from '../redux/authSlice/authSlice'
import { setCurrentState } from '../redux/courseIterationSlice/courseIterationSlice'
import { keycloakRealmName, keycloakUrl } from '../service/configService'
import { IconArrowBadgeRightFilled, IconArrowUp } from '@tabler/icons-react'
import { NavigationLayout } from '../utilities/NavigationLayout/NavigationLayout'
import { useWindowScroll } from '@mantine/hooks'
import styles from './ManagementConsole.module.scss'
import { useQuery } from 'react-query'
import { Application } from '../redux/applicationsSlice/applicationsSlice'
import { ApplicationType } from '../interface/application'
import { getApplications } from '../network/application'
import { Query } from '../state/query'
import { useApplicationStore } from '../state/zustand/useApplicationStore'

export const ManagementRoot = (): JSX.Element => {
  const [greetingMounted, setGreetingsMounted] = useState(false)

  useEffect(() => {
    setTimeout(() => {
      setGreetingsMounted(true)
    }, 500)
  }, [])

  return (
    <Transition
      mounted={greetingMounted}
      transition='slide-right'
      duration={600}
      timingFunction='ease'
    >
      {(transitionStyles) => (
        <Center style={{ ...transitionStyles, height: '90vh' }}>
          <Group>
            <Title order={3} c='dimmed'>
              Welcome back to PROMPT
            </Title>
            <IconArrowBadgeRightFilled style={{ color: '#2B70BE' }} />
          </Group>
        </Center>
      )}
    </Transition>
  )
}

const AccessRestricted = (): JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card withBorder p='xl'>
        <Title order={5}>Restricted acccess!</Title>
        <Text c='dimmed'>You do not have the necessary permissions to access this resource..</Text>
      </Card>
    </div>
  )
}

interface ManagmentConsoleProps {
  child: React.ReactElement
  permission: string[]
  onKeycloakValueChange: (keycloak: Keycloak) => void
}

export const ManagementConsole = ({
  child,
  permission,
  onKeycloakValueChange,
}: ManagmentConsoleProps): JSX.Element => {
  const [scroll, scrollTo] = useWindowScroll()
  const mgmtAccess = useAppSelector((state) => state.auth.mgmtAccess)
  const [authenticated, setAuthenticated] = useState(false)
  const dispatch = useDispatch<AppDispatch>()
  const { currentState, courseIterations } = useAppSelector((state) => state.courseIterations)
  const { setDeveloperApplications, setCoachApplications, setTutorApplications } =
    useApplicationStore()

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keycloak = new Keycloak({
    realm: keycloakRealmName,
    url: keycloakUrl,
    clientId: 'prompt-client',
  })
  const [keycloakValue, setKeycloakValue] = useState<Keycloak>(keycloak)

  useEffect(() => {
    void keycloak
      .init({ onLoad: 'login-required' })
      .then((isAuthenticated) => {
        if (isAuthenticated) {
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
                mgmtAccess: permission.some((p) => keycloak.hasResourceRole(p, 'prompt-server')),
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
        onKeycloakValueChange(keycloak)
      })
      .catch((err) => {
        alert(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  useEffect(() => {
    if (authenticated && !currentState) {
      void dispatch(fetchAllCourseIterations())
    }
  }, [authenticated, currentState, dispatch])

  useEffect(() => {
    if (!currentState && courseIterations.length > 0 && localStorage.getItem('course-iteration')) {
      const savedCourseIteration = courseIterations.find(
        (as) => as.id === localStorage.getItem('course-iteration'),
      )
      if (savedCourseIteration) {
        void dispatch(setCurrentState(savedCourseIteration))
      }
    }
  }, [currentState, courseIterations, dispatch])

  useEffect(() => {
    if (authenticated && !mgmtAccess) {
      void keycloakValue.logout()
    }
  }, [authenticated, keycloakValue, mgmtAccess])

  const { data: developerApplications } = useQuery<Application[]>({
    queryKey: [Query.DEVELOPER_APPLICATION, currentState?.semesterName],
    queryFn: () => getApplications(ApplicationType.DEVELOPER, currentState?.semesterName ?? ''),
    enabled: !!currentState,
    select: (applications) =>
      applications.map((application) => {
        return { ...application, type: ApplicationType.DEVELOPER }
      }),
  })
  const { data: coachApplications } = useQuery<Application[]>({
    queryKey: [Query.COACH_APPLICATION, currentState?.semesterName],
    queryFn: () => getApplications(ApplicationType.COACH, currentState?.semesterName ?? ''),
    enabled: !!currentState,
    select: (applications) =>
      applications.map((application) => {
        return { ...application, type: ApplicationType.COACH }
      }),
  })
  const { data: tutorApplications } = useQuery<Application[]>({
    queryKey: [Query.TUTOR_APPLICATION, currentState?.semesterName],
    queryFn: () => getApplications(ApplicationType.TUTOR, currentState?.semesterName ?? ''),
    enabled: !!currentState,
    select: (applications) =>
      applications.map((application) => {
        return { ...application, type: ApplicationType.TUTOR }
      }),
  })

  useEffect(() => {
    if (developerApplications) {
      setDeveloperApplications(developerApplications)
    }
  }, [developerApplications, setDeveloperApplications])
  useEffect(() => {
    if (coachApplications) {
      setCoachApplications(coachApplications)
    }
  }, [coachApplications, setCoachApplications])
  useEffect(() => {
    if (tutorApplications) {
      setTutorApplications(tutorApplications)
    }
  }, [tutorApplications, setTutorApplications])

  return (
    <div className={styles.root}>
      {authenticated && mgmtAccess ? (
        <div>
          {currentState ? (
            <NavigationLayout keycloak={keycloakValue}>
              {authenticated && <div style={{ margin: '2vh 2vw' }}>{child}</div>}
            </NavigationLayout>
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
      <Affix position={{ bottom: 20, right: 20 }}>
        <Transition transition='slide-up' mounted={scroll.y > 0}>
          {(transitionStyles) => (
            <Button
              leftSection={<IconArrowUp style={{ width: rem(16), height: rem(16) }} />}
              style={transitionStyles}
              onClick={() => scrollTo({ y: 0 })}
            >
              Scroll to top
            </Button>
          )}
        </Transition>
      </Affix>
    </div>
  )
}
