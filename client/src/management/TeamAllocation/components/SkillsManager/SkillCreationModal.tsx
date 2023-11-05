import { Button, Checkbox, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { type Skill } from '../../../../redux/skillsSlice/skillsSlice'
import { IconPlus } from '@tabler/icons-react'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../../redux/store'
import { createSkill } from '../../../../redux/skillsSlice/thunks/createSkill'

interface SkillCreationModalProps {
  opened: boolean
  onClose: () => void
}

export const SkillCreationModal = ({ opened, onClose }: SkillCreationModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const form = useForm<Skill>({
    initialValues: {
      title: '',
      description: '',
      active: true,
    },
  })

  const close = (): void => {
    form.reset()
    onClose()
  }

  return (
    <Modal opened={opened} onClose={close} centered>
      <form style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
        <Stack>
          <TextInput
            withAsterisk
            required
            label='Title'
            placeholder='Title'
            {...form.getInputProps('title')}
          />
          <TextInput
            withAsterisk
            required
            label='Description'
            placeholder='Description'
            {...form.getInputProps('description')}
          />
          <Checkbox
            mt='md'
            label='Active'
            {...form.getInputProps('active', { type: 'checkbox' })}
          />
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              void dispatch(createSkill(form.values))
              close()
            }}
          >
            Create
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
