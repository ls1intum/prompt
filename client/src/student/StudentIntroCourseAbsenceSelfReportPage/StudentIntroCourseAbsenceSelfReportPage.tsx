import { Button, Group, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { isNotEmpty, useForm } from '@mantine/form'
import { IconCalendar, IconLogout } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'
import { postIntroCourseAbsenceSelfReport } from '../../network/introCourse'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Query } from '../../state/query'
import Keycloak from 'keycloak-js'
import { IntroCourseAbsenceReportStatus } from '../../interface/introCourse'
import { useEffect, useState } from 'react'
import { jwtDecode } from 'jwt-decode'
import { keycloakRealmName, keycloakUrl } from '../../network/configService'

interface StudentIntroCourseAbsenceSelfReportPageProps {
  onKeycloakValueChange: (keycloak: Keycloak) => void
}

export const StudentIntroCourseAbsenceSelfReportPage = ({
  onKeycloakValueChange,
}: StudentIntroCourseAbsenceSelfReportPageProps): JSX.Element => {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const keycloak = new Keycloak({
    realm: keycloakRealmName,
    url: keycloakUrl,
    clientId: 'prompt-client',
  })
  const [keycloakValue, setKeycloakValue] = useState<Keycloak>(keycloak)
  const [authenticated, setAuthenticated] = useState(false)
  const queryClient = useQueryClient()
  const { semesterName } = useParams()
  const formInitialValues = {
    id: '',
    tumId: '',
    date: new Date(),
    excuse: '',
    selfReported: true,
    status: 'PENDING' as keyof typeof IntroCourseAbsenceReportStatus,
  }
  const introCourseAbsenceSelfReport = useForm({
    initialValues: {
      ...formInitialValues,
    },
    validate: {
      tumId: (value) =>
        /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{3}$/.test(value ?? '') ? null : 'This is not a valid TUM ID',
      date: isNotEmpty('Please select a date'),
      excuse: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please state an excuse for your absence on this day.'
        } else if (value.length > 255) {
          return 'The maximum allowed number of characters is 255.'
        }
      },
    },
  })

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
            introCourseAbsenceSelfReport.setFieldValue('tumId', decodedJwt.preferred_username)
            introCourseAbsenceSelfReport.setInitialValues({
              ...formInitialValues,
              tumId: decodedJwt.preferred_username,
            })
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

  const createIntroCourseAbsenceSelfReport = useMutation({
    mutationFn: () =>
      postIntroCourseAbsenceSelfReport(
        semesterName ?? '',
        introCourseAbsenceSelfReport.values.tumId,
        introCourseAbsenceSelfReport.values,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE_PARTICIPATIONS] })
      introCourseAbsenceSelfReport.reset()
    },
  })

  return (
    <>
      {authenticated && (
        <div style={{ margin: '5vh 5vw' }}>
          <Group justify='flex-end'>
            <Button leftSection={<IconLogout />} onClick={() => void keycloakValue.logout()}>
              Logout
            </Button>
          </Group>
          <Stack style={{ padding: '20vh 30vw', justifyContent: 'center' }}>
            <TextInput
              withAsterisk
              required
              disabled
              label='TUM ID'
              placeholder='TUM ID'
              {...introCourseAbsenceSelfReport.getInputProps('tumId')}
            />

            <DatePickerInput
              withAsterisk
              required
              leftSection={<IconCalendar />}
              label='Date'
              {...introCourseAbsenceSelfReport.getInputProps('date')}
            />
            <div>
              <Textarea
                autosize
                minRows={5}
                withAsterisk
                required
                label='Excuse'
                placeholder='Excuse'
                {...introCourseAbsenceSelfReport.getInputProps('excuse')}
              />
              {!introCourseAbsenceSelfReport.errors.excuse && (
                <Text fz='xs' ta='right'>{`${
                  introCourseAbsenceSelfReport.values.excuse?.length ?? 0
                } / 255`}</Text>
              )}
            </div>
            <Group justify='flex-end'>
              <Button
                disabled={
                  !introCourseAbsenceSelfReport.isValid() || !introCourseAbsenceSelfReport.isDirty()
                }
                onClick={() => {
                  createIntroCourseAbsenceSelfReport.mutate()
                }}
              >
                Save
              </Button>
            </Group>
          </Stack>
        </div>
      )}
    </>
  )
}
