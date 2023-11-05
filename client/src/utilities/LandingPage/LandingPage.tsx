import { Button, Card, Group, Stack, Title } from '@mantine/core'
import { IconBrandSwift, IconLogin, IconSchool, IconUsersGroup } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import styles from './LandingPage.module.scss'

export const LandingPage = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className={styles.root}>
      <Group justify='flex-end'>
        <Button leftSection={<IconLogin />} onClick={() => navigate('/management')}>
          Login as Chair Member
        </Button>
      </Group>
      <div className={styles.menu}>
        <Card withBorder p='xl'>
          <Stack>
            <Title order={5}>
              Please select the practical course you want to apply for from the list below.
            </Title>
            <Button
              onClick={() => {
                navigate('/applications/developer')
              }}
              leftSection={<IconBrandSwift />}
            >
              iPraktikum
            </Button>
            <Button
              onClick={() => {
                navigate('/applications/coach')
              }}
              leftSection={<IconUsersGroup />}
            >
              Agile Project Management
            </Button>
            <Button
              onClick={() => {
                navigate('/applications/tutor')
              }}
              leftSection={<IconSchool />}
            >
              Teaching iOS
            </Button>
          </Stack>
        </Card>
      </div>
    </div>
  )
}
