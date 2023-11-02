import { Button, Card, Stack, Title } from '@mantine/core'
import { IconBrandSwift, IconSchool, IconUsersGroup } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'

export const RootPage = (): JSX.Element => {
  const navigate = useNavigate()

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
  )
}
