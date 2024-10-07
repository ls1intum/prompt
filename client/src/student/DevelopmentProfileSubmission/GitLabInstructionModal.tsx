import { Anchor, Box, Modal, Text, Image, Stack, Title, Divider } from '@mantine/core'
import gitlabInstructionImage from '../../static/gitlab-instruction.png'

interface GitLabInstructionModelProps {
  gitLabInstructionModalOpen: boolean
  setgitLabInstructionModalOpen: (open: boolean) => void
}

export const GitLabInstructionModal = ({
  gitLabInstructionModalOpen,
  setgitLabInstructionModalOpen,
}: GitLabInstructionModelProps): JSX.Element => {
  return (
    <Modal
      centered
      opened={gitLabInstructionModalOpen}
      onClose={() => setgitLabInstructionModalOpen(false)}
      size='80%'
      title={
        <Title order={3} c='dimmed'>
          GitLab Instruction
        </Title>
      }
    >
      <Stack>
        <Text fz='sm'>
          In order to create a GitLab account, please follow the instructions below:
        </Text>
        <Divider />
        <Text fz='sm'>
          1. Go to the LRZ Gitlab profile page:{' '}
          <Anchor href='https://gitlab.lrz.de/-/profile/account' target='_blank'>
            https://gitlab.lrz.de/-/profile/account
          </Anchor>
        </Text>
        <Text fz='sm'>
          2. Log in with your TUM LDAP credentials. (These are usually the same as for campus.tum.de
          - i.e. geXXabc)
        </Text>
        <Text fz='sm'>3. Scroll down till you see 'Change username'.</Text>
        <Box style={{ textAlign: 'center' }}>
          <Image
            src={gitlabInstructionImage}
            alt='GitLab Username'
            style={{
              maxWidth: '100%',
              maxHeight: '250px',
              width: 'auto',
              height: 'auto',
              border: '2px solid #ccc', // Hinzufügen einer Umrandung
              borderRadius: '8px', // Optional: Abrunden der Ecken
            }}
          />
        </Box>
        <Text fz='sm' fw={700}>
          4. Copy just the part of 'your-username' without the 'https://....'.
        </Text>{' '}
      </Stack>
    </Modal>
  )
}
