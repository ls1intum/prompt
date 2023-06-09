import { Button, Modal, TextInput } from '@mantine/core'
import { useState } from 'react'

interface ProjectTeamPreferencesSubmissionCodeModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (submissionCode: string) => void
}

export const ProjectTeamPreferencesSubmissionCodeModal = ({
  open,
  onClose,
  onSubmit,
}: ProjectTeamPreferencesSubmissionCodeModalProps): JSX.Element => {
  const [submissionCode, setSubmissionCode] = useState('')

  return (
    <Modal
      opened={open}
      onClose={onClose}
      centered
      title='Please provide the submission code to access the form'
    >
      <TextInput
        value={submissionCode}
        onChange={(e) => {
          setSubmissionCode(e.target.value)
        }}
      />
      <Button
        variant='filled'
        onClick={() => {
          onSubmit(submissionCode)
          onClose()
        }}
        style={{ marginTop: '2vh' }}
      >
        Submit
      </Button>
    </Modal>
  )
}
