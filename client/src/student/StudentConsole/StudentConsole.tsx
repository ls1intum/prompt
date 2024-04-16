import Keycloak from 'keycloak-js'
import { keycloakRealmName, keycloakUrl } from '../../network/configService'
import { useEffect, useState } from 'react'
import { Button, Group } from '@mantine/core'
import { IconLogout } from '@tabler/icons-react'
import { jwtDecode } from 'jwt-decode'
import { useAuthenticationStore } from '../../state/zustand/useAuthenticationStore'

interface StudentConsoleProps {
  child: React.ReactElement
  onKeycloakValueChange: (keycloak: Keycloak) => void
}

export const StudentConsole = ({
  child,
  onKeycloakValueChange,
}: StudentConsoleProps): JSX.Element => {
  const { setUser, setPermissions } = useAuthenticationStore()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keycloak = new Keycloak({
    realm: keycloakRealmName,
    url: keycloakUrl,
    clientId: 'prompt-client',
  })
  const [keycloakValue, setKeycloakValue] = useState<Keycloak>(keycloak)
  const [authenticated, setAuthenticated] = useState(false)

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
              mgmtAccess: false,
            })
            if (keycloak.resourceAccess) {
              setPermissions(keycloak.resourceAccess['prompt-server'].roles)
            }
          }
        } catch (error) {}
        setKeycloakValue(keycloak)
        onKeycloakValueChange(keycloak)
      })
      .catch((err) => {
        alert(err)
      })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      {authenticated && (
        <div style={{ margin: '5vh 5vw' }}>
          <Group justify='flex-end'>
            <Button leftSection={<IconLogout />} onClick={() => void keycloakValue.logout()}>
              Logout
            </Button>
          </Group>
          {child}
        </div>
      )}
    </>
  )
}
