import { useEffect, useState } from 'react'
import { Anchor, Button, Center, Container, Group, Stack, TextInput, Title } from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import { postDevelopmentProfile } from '../../network/introCourse'
import { DevelopmentProfile } from '../../interface/application'
import { useAuthenticationStore } from '../../state/zustand/useAuthenticationStore'
import { getDevelopmentProfile } from '../../network/student'
import { GitLabInstructionModal } from './GitLabInstructionModal'

export const DevelopmentProfileSubmission = (): JSX.Element => {
  const { user } = useAuthenticationStore()
  const form = useForm<DevelopmentProfile>({
    initialValues: {
      id: '',
      gitlabUsername: '',
      appleId: '',
      macBookDeviceId: '',
      iPhoneDeviceId: '',
      iPadDeviceId: '',
      appleWatchDeviceId: '',
    },
    validate: {
      appleId: isNotEmpty('Please provide a valid Apple ID.'),
      gitlabUsername: isNotEmpty('Please provide a GitLab username.'),
    },
    validateInputOnChange: true,
  })

  const [gitLabInstructionModalOpen, setgitLabInstructionModalOpen] = useState(false)

  useEffect(() => {
    ;(async () => {
      if (user) {
        const developmentProfile = await getDevelopmentProfile()
        if (developmentProfile) {
          form.setValues(developmentProfile)
          form.resetDirty()
        }
      }
    })()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  return (
    <div style={{ margin: '5vh' }}>
      <GitLabInstructionModal
        gitLabInstructionModalOpen={gitLabInstructionModalOpen}
        setgitLabInstructionModalOpen={setgitLabInstructionModalOpen}
      />

      <Center style={{ display: 'flex', flexDirection: 'column', gap: '3vh' }}>
        <Title order={2}>Development Profile Submission</Title>
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
          <TextInput
            label='LRZ GitLab Username'
            placeholder='LRZ GitLab Username'
            required
            withAsterisk
            {...form.getInputProps('gitlabUsername')}
            description={
              <Anchor c='blue' fz='sm' onClick={() => setgitLabInstructionModalOpen(true)}>
                How to get it?
              </Anchor>
            }
          />
          <Group grow>
            <TextInput
              label='MacBook UUID'
              description={
                <Anchor
                  href='https://developer.apple.com/documentation/xcode/distributing-your-app-to-registered-devices#Collect-device-identifiers-macOS'
                  target='_blank'
                  c='blue'
                  fz='sm'
                >
                  How to get it?
                </Anchor>
              }
              placeholder='MacBook UUID'
              {...form.getInputProps('macBookDeviceId')}
            />
            <TextInput
              label='iPhone UDID'
              description={
                <Anchor
                  href='https://developer.apple.com/documentation/xcode/distributing-your-app-to-registered-devices#Collect-device-identifiers-iOS-iPadOS-tvOS-watchOS'
                  target='_blank'
                  c='blue'
                  fz='sm'
                >
                  How to get it?
                </Anchor>
              }
              placeholder='iPhone UDID'
              {...form.getInputProps('iPhoneDeviceId')}
            />
          </Group>
          <Group grow>
            <TextInput
              label='iPad UDID'
              description={
                <Anchor
                  href='https://developer.apple.com/documentation/xcode/distributing-your-app-to-registered-devices#Collect-device-identifiers-iOS-iPadOS-tvOS-watchOS'
                  target='_blank'
                  c='blue'
                  fz='sm'
                >
                  How to get it?
                </Anchor>
              }
              placeholder='iPad UDID'
              {...form.getInputProps('iPadDeviceId')}
            />
            <TextInput
              label='Apple Watch UDID'
              description={
                <Anchor
                  href='https://developer.apple.com/documentation/xcode/distributing-your-app-to-registered-devices#Collect-device-identifiers-iOS-iPadOS-tvOS-watchOS'
                  target='_blank'
                  c='blue'
                  fz='sm'
                >
                  How to get it?
                </Anchor>
              }
              placeholder='Apple Watch UDID'
              {...form.getInputProps('appleWatchDeviceId')}
            />
          </Group>
        </Stack>
        <Group justify='flex-end'>
          <Button
            variant='filled'
            disabled={!form.isValid() || !form.isDirty()}
            onClick={() => {
              postDevelopmentProfile(form.values)
              form.resetDirty()
            }}
          >
            Submit
          </Button>
        </Group>
      </Container>
    </div>
  )
}
