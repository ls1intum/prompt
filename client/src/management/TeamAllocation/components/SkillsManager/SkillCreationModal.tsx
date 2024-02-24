import { Button, Checkbox, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { IconPlus } from '@tabler/icons-react'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postSkill } from '../../../../network/skill'
import { Query } from '../../../../state/query'
import { Skill } from '../../../../interface/skill'
import { useCourseIterationStore } from '../../../../state/zustand/useCourseIterationStore'
import { useEffect } from 'react'

interface SkillCreationModalProps {
  opened: boolean
  onClose: () => void
}

export const SkillCreationModal = ({ opened, onClose }: SkillCreationModalProps): JSX.Element => {
  const { selectedCourseIteration } = useCourseIterationStore()
  const queryClient = useQueryClient()
  const form = useForm<Skill>({
    initialValues: {
      courseIterationId: selectedCourseIteration?.id ?? '',
      title: '',
      description: '',
      active: true,
    },
  })

  const createSkill = useMutation({
    mutationFn: (skill: Skill) => {
      return postSkill(skill)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.SKILL] })
    },
  })

  useEffect(() => {
    if (selectedCourseIteration) {
      form.setFieldValue('courseIterationId', selectedCourseIteration.id)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCourseIteration])

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
              createSkill.mutate(form.values)
            }}
          >
            Create
          </Button>
        </Stack>
      </form>
    </Modal>
  )
}
