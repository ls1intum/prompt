import { Group, Anchor, Text } from '@mantine/core'
import * as styles from '../LandingPage.module.scss'
import { useNavigate } from 'react-router-dom'
import packageJSON from '../../../../package.json'

export const Footer = (): JSX.Element => {
  const navigate = useNavigate()
  const version = packageJSON.version

  return (
    <footer className={styles.footer}>
      <Group justify='space-between' align='center'>
        <Group gap='xs'>
          <Anchor href='https://ase.cit.tum.de/' size='sm' style={{ color: 'inherit' }}>
            <Text size='sm'>
              © {new Date().getFullYear()} TUM, CIT, Research Group for Applied Education
              Technologies
            </Text>
          </Anchor>
          <Anchor
            style={{ color: 'inherit' }}
            href={`https://github.com/ls1intum/prompt`}
            target='_blank'
            size='sm'
          >
            v{version}
          </Anchor>
        </Group>
        <Group gap='xs'>
          <Anchor size='sm' style={{ color: 'inherit' }} onClick={() => navigate('/imprint')}>
            Imprint
          </Anchor>
          <Anchor size='sm' style={{ color: 'inherit' }} onClick={() => navigate('/privacy')}>
            Privacy
          </Anchor>
        </Group>
      </Group>
    </footer>
  )
}
