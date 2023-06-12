import { Button, Group, Modal, Stack, Text } from '@mantine/core'
import { type CoursePhaseCheck } from '../../../../redux/coursePhasesSlice/coursePhasesSlice'

interface CoursePhaseCheckDeletionConfirmationModalProps {
  opened: boolean
  onClose: () => void
  onConfirm: () => void
  coursePhaseCheck: CoursePhaseCheck
}

export const CoursePhaseCheckDeletionConfirmationModal = ({
  opened,
  onClose,
  onConfirm,
  coursePhaseCheck,
}: CoursePhaseCheckDeletionConfirmationModalProps): JSX.Element => {
  return (
    <Modal centered opened={opened} onClose={onClose}>
      <Stack>
        <Text>
          Are You sure You want to delete the course phase check &quot;{coursePhaseCheck.title}
          &quot;?
        </Text>
        <Group position='center'>
          <Button onClick={onConfirm}>Confirm</Button>
        </Group>
      </Stack>
    </Modal>
  )
}
