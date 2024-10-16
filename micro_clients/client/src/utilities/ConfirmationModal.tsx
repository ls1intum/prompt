import { Button, Group, Modal, Stack, Text } from '@mantine/core'

interface ConfirmationModalProps {
  title: string
  text: string
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}

export const ConfirmationModal = ({
  opened,
  onClose,
  onConfirm,
  title,
  text,
}: ConfirmationModalProps): JSX.Element => {
  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      title={
        <Text c='dimmed' fz='sm'>
          {title}
        </Text>
      }
      size='auto'
    >
      <Stack>
        <Text fz='sm' fw={500}>
          {text}
        </Text>
        <Group align='center'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
