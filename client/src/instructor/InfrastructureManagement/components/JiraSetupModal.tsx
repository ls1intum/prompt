import { Button, Modal, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  createJiraProjectCategory,
  type JiraUserGroup,
  type JiraProjectCategory,
  createJiraUserGroup,
  AddUserToJiraGroup,
} from '../../../service/infrastructureSetupService'

interface JiraSetupModalProps {
  opened: boolean
  onClose: () => void
}

export const JiraAddUserToUserGroupModal = ({
  opened,
  onClose,
}: JiraSetupModalProps): JSX.Element => {
  const form = useForm({
    initialValues: {
      username: '',
      groupName: '',
    },
  })

  return (
    <Modal opened={opened} onClose={onClose} centered>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
        <TextInput
          withAsterisk
          required
          label='Username'
          placeholder='Username'
          {...form.getInputProps('username')}
        />
        <TextInput
          withAsterisk
          required
          label='Group Name'
          placeholder='Group name'
          {...form.getInputProps('groupName')}
        />
        <Button
          variant='filled'
          onClick={() => {
            void (async () => {
              const response = await AddUserToJiraGroup(form.values)
              if (response) {
                form.reset()
                onClose()
              }
            })()
          }}
        >
          Submit
        </Button>
      </form>
    </Modal>
  )
}

export const JiraUserGroupCreationModal = ({
  opened,
  onClose,
}: JiraSetupModalProps): JSX.Element => {
  const form = useForm<JiraUserGroup>({
    initialValues: {
      name: '',
    },
  })

  return (
    <Modal opened={opened} onClose={onClose} centered>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
        <TextInput
          withAsterisk
          required
          label='User Group Name'
          placeholder='User group name'
          {...form.getInputProps('name')}
        />
        <Button
          variant='filled'
          onClick={() => {
            void (async () => {
              const response = await createJiraUserGroup(form.values)
              if (response) {
                form.reset()
                onClose()
              }
            })()
          }}
        >
          Submit
        </Button>
      </form>
    </Modal>
  )
}

export const JiraProjectCategoryCreationModal = ({
  opened,
  onClose,
}: JiraSetupModalProps): JSX.Element => {
  const form = useForm<JiraProjectCategory>({
    initialValues: {
      name: '',
      description: '',
    },
  })

  return (
    <Modal opened={opened} onClose={onClose} centered>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
        <TextInput
          withAsterisk
          required
          label='Category Name'
          placeholder='Category name'
          {...form.getInputProps('name')}
        />
        <TextInput
          withAsterisk
          required
          label='Category Description'
          placeholder='Category description'
          {...form.getInputProps('description')}
        />
        <Button
          variant='filled'
          onClick={() => {
            void (async () => {
              const response = await createJiraProjectCategory(form.values)
              if (response) {
                form.reset()
                onClose()
              }
            })()
          }}
        >
          Submit
        </Button>
      </form>
    </Modal>
  )
}

export const JiraSetupModal = ({ opened, onClose }: JiraSetupModalProps): JSX.Element => {
  const form = useForm({
    initialValues: {
      iosTag: '',
      projectLeadUsername: '',
    },
  })

  return (
    <Modal opened={opened} onClose={onClose} centered>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
        <TextInput
          withAsterisk
          required
          label='IOS Tag'
          placeholder='IOSXX'
          {...form.getInputProps('iosTag')}
        />
        <TextInput
          withAsterisk
          required
          label='Project Lead Username'
          placeholder='Project lead username'
          {...form.getInputProps('projectLeadUsername')}
        />
      </form>
    </Modal>
  )
}
