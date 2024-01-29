import Keycloak from 'keycloak-js'
import { axiosInstance, keycloakRealmName, keycloakUrl } from '../../service/configService'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../../redux/store'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { setAuthState } from '../../redux/authSlice/authSlice'
import { ThesisApplicationsDatatable } from './components/ThesisApplicationsDatatable'
import { Affix, Button, Center, Transition, rem } from '@mantine/core'
import { IconArrowUp } from '@tabler/icons-react'
import { useWindowScroll } from '@mantine/hooks'
import styles from './ThesisApplicationsManagementConsole.module.scss'
import { useMutation, useQueryClient } from 'react-query'
import { putThesisAdvisor } from '../../network/thesisApplication'
import { ThesisAdvisor } from '../../interface/thesisApplication'
import { Query } from '../../state/query'

export const ThesisApplicationsManagementConsole = (): JSX.Element => {
  const queryClient = useQueryClient()
  const dispatch = useDispatch<AppDispatch>()
  const [scroll, scrollTo] = useWindowScroll()
  const [authenticated, setAuthenticated] = useState(false)
  const mgmtAccess = useAppSelector((state) => state.auth.mgmtAccess)

  const addThesisAdvisor = useMutation({
    mutationFn: (thesisAdvisor: ThesisAdvisor) => putThesisAdvisor(thesisAdvisor),
    onSuccess: () => {
      queryClient.invalidateQueries(Query.THESIS_APPLICATION)
    },
  })

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keycloak = new Keycloak({
    realm: keycloakRealmName,
    url: keycloakUrl,
    clientId: 'prompt-client',
  })
  const [keycloakValue, setKeycloakValue] = useState<Keycloak>(keycloak)

  useEffect(() => {
    if (keycloakValue) {
      axiosInstance.interceptors.request.use(
        async (config) => {
          if (keycloakValue.isTokenExpired(43200)) {
            await keycloakValue?.updateToken(60)
          }
          return config
        },
        (error) => {
          Promise.reject(error)
        },
      )
    }
  }, [keycloakValue])

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
                mgmtAccess:
                  keycloak.hasResourceRole('chair-member', 'prompt-server') ||
                  keycloak.hasResourceRole('prompt-admin', 'prompt-server'),
              }),
            )

            if (keycloak.hasResourceRole('chair-member', 'prompt-server')) {
              addThesisAdvisor.mutate({
                firstName: decodedJwt.given_name,
                lastName: decodedJwt.family_name,
                email: decodedJwt.email,
                tumId: decodedJwt.preferred_username,
              })
            }
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch])

  return (
    <div className={styles.root}>
      {authenticated && mgmtAccess && (
        <Center>
          <ThesisApplicationsDatatable />
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
        </Center>
      )}
    </div>
  )
}
