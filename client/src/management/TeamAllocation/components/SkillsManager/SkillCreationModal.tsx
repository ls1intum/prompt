import { Button, Checkbox, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus } from '@tabler/icons-react'
import { useMutation, useQueryClient } from 'react-query'
import { postSkill } from '../../../../network/skill'
import { Query } from '../../../../state/query'
import { Skill } from '../../../../interface/skill'

interface SkillCreationModalProps {
  opened: boolean
  onClose: () => void
}

export const SkillCreationModal = ({ opened, onClose }: SkillCreationModalProps): JSX.Element => {
  const queryClient = useQueryClient()
  const form = useForm<Skill>({
    initialValues: {
      title: '',
      description: '',
      active: true,
    },
  })

  const createSkill = useMutation({
    mutationFn: () => {
      return postSkill(form.values)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.SKILL] })
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
              createSkill.mutate()
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
