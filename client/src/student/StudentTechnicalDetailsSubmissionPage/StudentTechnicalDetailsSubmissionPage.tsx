import { useEffect, useState } from 'react'
import {
  Button,
  Card,
  Center,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { StudentTechnicalDetailsSubmissionCodeModal } from './components/StudentTechnicalDetailsSubmissionCodeModal'
import { useParams } from 'react-router-dom'
import { TechnicalDetails } from '../../interface/introCourse'
import { postTechnicalDetails } from '../../network/introCourse'

interface SuccessfulSubmissionProps {
  title: string
  text: string
}

const SuccessfulSubmission = ({ title, text }: SuccessfulSubmissionProps): JSX.Element => {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Card withBorder p='xl'>
        <Title order={5}>{title}</Title>
        <Text c='dimmed'>{text}</Text>
      </Card>
    </div>
  )
}

export const StudentTechnicalDetailsSubmissionPage = (): JSX.Element => {
  const { semesterName } = useParams()
  const [studentId, setStudentId] = useState('')
  const [studentVerificationDialogOpened, setStudentVerificationDialogOpened] = useState(false)
  const form = useForm<TechnicalDetails>({
    initialValues: {
      appleId: '',
      macBookDeviceId: '',
      iPhoneDeviceId: '',
      iPadDeviceId: '',
      appleWatchDeviceId: '',
    },
    validate: {
      appleId: isNotEmpty('Please provide a valid Apple ID.'),
    },
    validateInputOnChange: true,
  })
  const [formSubmitted, setFormSubmitted] = useState(false)

  useEffect(() => {
    if (!studentId) {
      setStudentVerificationDialogOpened(true)
    }
  }, [studentId])

  return (
    <div style={{ margin: '5vh' }}>
      {formSubmitted && (
        <SuccessfulSubmission
          title='Your technical details have been successfully submitted.'
          text='You can now close this page.'
        />
      )}
      {!formSubmitted && (
        <>
          <StudentTechnicalDetailsSubmissionCodeModal
            open={studentVerificationDialogOpened}
            onClose={() => {
              setStudentVerificationDialogOpened(false)
            }}
            onSubmit={setStudentId}
          />
          <Center style={{ display: 'flex', flexDirection: 'column', gap: '3vh' }}>
            <Title order={2}>Technical Details Submission Form</Title>
          </Center>
          <Container size='70vw' style={{ padding: '3vh' }}>
            <Stack style={{ paddingBottom: '5vh' }}>
              <TextInput
                label='Apple ID'
                placeholder='Apple ID'
                required
                withAsterisk
                {...form.getInputProps('appleId')}
              />
              <Group grow>
                <TextInput
                  label='MacBook Device ID'
                  placeholder='MacBook Device ID'
                  {...form.getInputProps('macBookDeviceId')}
                />
                <TextInput
                  label='iPhone Device ID'
                  placeholder='iPhone Device ID'
                  {...form.getInputProps('iPhoneDeviceId')}
                />
              </Group>
              <Group grow>
                <TextInput
                  label='iPad Device ID'
                  placeholder='iPad Device ID'
                  {...form.getInputProps('iPadDeviceId')}
                />
                <TextInput
                  label='Apple Watch Device ID'
                  placeholder='Apple Watch Device ID'
                  {...form.getInputProps('appleWatchDeviceId')}
                />
              </Group>
            </Stack>
          </Container>
          <Center>
            <Button
              variant='filled'
              disabled={!form.isValid()}
              onClick={() => {
                void (async () => {
                  if (studentId) {
                    if (semesterName && studentId) {
                      const response = await postTechnicalDetails({
                        semesterName,
                        studentId,
                        technicalDetails: form.values,
                      })
                      if (response) {
                        setFormSubmitted(true)
                      }
                    }
                  }
                })()
              }}
            >
              Submit
            </Button>
          </Center>
        </>
      )}
    </div>
  )
}
