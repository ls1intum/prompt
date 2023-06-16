import { Button, Group, Modal, Stack, Text } from '@mantine/core'

interface DeletionConfirmationModalProps {
  title: string
  text: string
  opened: boolean
  onClose: () => void
  onConfirm: () => void
}

export const DeletionConfirmationModal = ({
  opened,
  onClose,
  onConfirm,
  title,
  text,
}: DeletionConfirmationModalProps): JSX.Element => {
  return (
    <Modal centered opened={opened} onClose={onClose} title={title}>
      <Stack>
        <Text>{text}</Text>
        <Group position='center'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={onConfirm}>Confirm</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
