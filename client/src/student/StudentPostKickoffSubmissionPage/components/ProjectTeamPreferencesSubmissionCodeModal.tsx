import { Button, Group, Modal, TextInput } from '@mantine/core'
import { useState } from 'react'
import { serverBaseUrl } from '../../../service/configService'
import axios from 'axios'
import { useParams } from 'react-router-dom'

interface ProjectTeamPreferencesSubmissionCodeModalProps {
  open: boolean
  onClose: () => void
  onSubmit: (studentId: string) => void
}

export const ProjectTeamPreferencesSubmissionCodeModal = ({
  open,
  onClose,
  onSubmit,
}: ProjectTeamPreferencesSubmissionCodeModalProps): JSX.Element => {
  const { studentPublicId } = useParams()
  const [matriculationNumber, setMatriculationNumber] = useState('')
  const [error, setError] = useState('')

  const onFormSubmit = async (): Promise<void> => {
    try {
      const response = await axios.post(
        `${serverBaseUrl}/api/post-kickoff-submissions/verify-student/${studentPublicId ?? ''}`,
        matriculationNumber,
        { headers: { 'Content-Type': 'text/plain' } },
      )
      if (response.data) {
        setError('')
        onSubmit(response.data)
        onClose()
      }
    } catch (err) {
      if (axios.isAxiosError(err) && err.response?.status === 409) {
        setError('Submission already exists.')
      }
    }
  }

  return (
    <Modal
      opened={open}
      onClose={onClose}
      centered
      title='Please provide your matriculation number to verify yourself'
      closeOnClickOutside={false}
      closeOnEscape={false}
      withCloseButton={false}
    >
      <TextInput
        value={matriculationNumber}
        error={error}
        onChange={(e) => {
          setMatriculationNumber(e.target.value)
        }}
      />
      <Group position='center'>
        <Button
          variant='filled'
          onClick={() => {
            void onFormSubmit()
          }}
          style={{ marginTop: '2vh' }}
        >
          Submit
        </Button>
      </Group>
    </Modal>
  )
}
