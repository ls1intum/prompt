import { Modal } from '@mantine/core'
import React from 'react'
import {
  StudentApplicationAccessMode,
  StudentApplicationForm,
} from '../../forms/StudentApplicationForm'
import { type StudentApplication } from '../../service/studentApplicationService'

interface StudentApplicationModalProps {
  open: boolean
  onClose: () => void
  studentApplication: StudentApplication
}

export const StudentApplicationModal = ({
  open,
  onClose,
  studentApplication,
}: StudentApplicationModalProps): JSX.Element => {
  return (
    <Modal opened={open} onClose={onClose} size='xl'>
      <StudentApplicationForm
        accessMode={StudentApplicationAccessMode.INSTRUCTOR}
        studentApplication={studentApplication}
        onSuccessfulSubmit={() => {
          console.log('submitted')
        }}
      />
    </Modal>
  )
}
