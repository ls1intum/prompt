import Keycloak from 'keycloak-js'
import { keycloakRealmName, keycloakUrl } from '../../service/configService'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../../redux/store'
import { useEffect, useState } from 'react'
import jwtDecode from 'jwt-decode'
import { setAuthState } from '../../redux/authSlice/authSlice'
import { ThesisApplicationsDatatable } from './components/ThesisApplicationsDatatable'
import { Center } from '@mantine/core'

export const ThesisApplicationsManagementConsole = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [authenticated, setAuthenticated] = useState(false)
  const mgmtAccess = useAppSelector((state) => state.auth.mgmtAccess)
  const keycloak = new Keycloak({
    realm: keycloakRealmName,
    url: keycloakUrl,
    clientId: 'prompt-client',
  })
  const [keycloakValue, setKeycloakValue] = useState<Keycloak>(keycloak)

  useEffect(() => {
    console.log(keycloakValue)
  }, [keycloakValue])

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
                mgmtAccess: keycloak.hasResourceRole('chair-member', 'prompt-server'),
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

  return (
    <>
      {authenticated && mgmtAccess && (
        <Center>
          <ThesisApplicationsDatatable />
        </Center>
      )}
    </>
  )
}
