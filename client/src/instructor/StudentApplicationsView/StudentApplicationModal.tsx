import { Modal } from '@mantine/core'
import { ApplicationFormAccessMode } from '../../forms/DefaultApplicationForm'
import { type DeveloperApplication } from '../../redux/studentApplicationSlice/studentApplicationSlice'
import { DeveloperApplicationForm } from '../../forms/DeveloperApplicationForm'

interface StudentApplicationModalProps {
  open: boolean
  onClose: () => void
  studentApplication: DeveloperApplication
}

export const StudentApplicationModal = ({
  open,
  onClose,
  studentApplication,
}: StudentApplicationModalProps): JSX.Element => {
  return (
    <Modal opened={open} onClose={onClose} size='xl'>
      <div style={{ padding: '3vh 3vw' }}>
        <DeveloperApplicationForm
          accessMode={ApplicationFormAccessMode.INSTRUCTOR}
          developerApplication={studentApplication}
          onSuccess={onClose}
        />
      </div>
    </Modal>
  )
}
