import { Button, Card, Group, Stack, Text, Title } from '@mantine/core'
import { IconDirection, IconDirections, IconLogin } from '@tabler/icons-react'
import { useNavigate } from 'react-router-dom'
import * as styles from './LandingPage.module.scss'
import { Footer } from './components/Footer'

export const LandingPage = (): JSX.Element => {
  const navigate = useNavigate()

  return (
    <div className={styles.root}>
      <div className={styles.content}>
        <Group justify='flex-end'>
          <Button leftSection={<IconLogin />} onClick={() => navigate('/management')}>
            Login as Chair Member
          </Button>
        </Group>
        <div className={styles.menu}>
          <Card withBorder shadow='sm' radius='md' p='xl' mb='xl'>
            <Stack align='center'>
              <IconDirections size={64} color='gray' />
              <Title order={4} className={styles.cardTitle} ta='center'>
                Looking to apply for courses at the Research Group for Applied Education
                Technologies?
              </Title>
              <Text className={styles.cardText}>We have moved to our new application tool.</Text>
              <Button
                size='lg'
                onClick={() => (window.location.href = 'https://prompt.aet.cit.tum.de')}
                className={styles.cardButton}
              >
                Go to the New Application Tool
              </Button>
            </Stack>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  )
}
