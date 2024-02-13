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
import { WorkspaceSelectionDialog } from './CourseIterationManager/components/CourseIterationManager/WorkspaceSelectionDialog'
import Keycloak from 'keycloak-js'
import { jwtDecode } from 'jwt-decode'
import { keycloakRealmName, keycloakUrl } from '../network/configService'
import { IconArrowBadgeRightFilled, IconArrowUp } from '@tabler/icons-react'
import { NavigationLayout } from '../utilities/NavigationLayout/NavigationLayout'
import { useWindowScroll } from '@mantine/hooks'
import styles from './ManagementConsole.module.scss'
import { useQuery } from '@tanstack/react-query'
import { Query } from '../state/query'
import { useCourseIterationStore } from '../state/zustand/useCourseIterationStore'
import { CourseIteration } from '../interface/courseIteration'
import { getCourseIterations } from '../network/courseIteration'
import { useAuthenticationStore } from '../state/zustand/useAuthenticationStore'

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
  const { user, setUser, setPermissions } = useAuthenticationStore()
  const [authenticated, setAuthenticated] = useState(false)
  const {
    selectedCourseIteration,
    courseIterations,
    setSelectedCourseIteration,
    setCourseIterations,
  } = useCourseIterationStore()

  const { data: fetchedCourseIterations } = useQuery<CourseIteration[]>({
    queryKey: [Query.COURSE_ITERATION],
    enabled: authenticated,
    queryFn: getCourseIterations,
  })

  useEffect(() => {
    setCourseIterations(fetchedCourseIterations ?? [])
  }, [fetchedCourseIterations, setCourseIterations])

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keycloak = new Keycloak({
    realm: keycloakRealmName,
    url: keycloakUrl,
    clientId: 'prompt-client',
  })
  const [keycloakValue, setKeycloakValue] = useState<Keycloak>(keycloak)

  useEffect(() => {
    keycloak.onTokenExpired = () => {
      keycloak.updateToken(5).then(() => {
        localStorage.setItem('jwt_token', keycloak.token ?? '')
        localStorage.setItem('refreshToken', keycloak.refreshToken ?? '')
      })
    }
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
            setUser({
              firstName: decodedJwt.given_name,
              lastName: decodedJwt.family_name,
              email: decodedJwt.email,
              username: decodedJwt.preferred_username,
              mgmtAccess: permission.some((p) => keycloak.hasResourceRole(p, 'prompt-server')),
            })
            if (keycloak.resourceAccess) {
              setPermissions(keycloak.resourceAccess['prompt-server'].roles)
            }
          }
        } catch (error) {
          setUser({
            firstName: '',
            lastName: '',
            email: '',
            username: '',
            mgmtAccess: false,
          })
        }
        setKeycloakValue(keycloak)
        onKeycloakValueChange(keycloak)
      })
      .catch((err) => {
        alert(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (
      !selectedCourseIteration &&
      courseIterations.length > 0 &&
      localStorage.getItem('course-iteration')
    ) {
      const savedCourseIteration = courseIterations.find(
        (as) => as.id === localStorage.getItem('course-iteration'),
      )
      if (savedCourseIteration) {
        setSelectedCourseIteration(savedCourseIteration)
      }
    }
  }, [selectedCourseIteration, courseIterations, setSelectedCourseIteration])

  useEffect(() => {
    if (authenticated && !user?.mgmtAccess) {
      void keycloakValue.logout()
    }
  }, [authenticated, keycloakValue, user])

  return (
    <div className={styles.root}>
      {authenticated && user && user.mgmtAccess ? (
        <div>
          {selectedCourseIteration ? (
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
          <Center>
            {authenticated && user && !user.mgmtAccess ? <AccessRestricted /> : <Loader />}
          </Center>
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
