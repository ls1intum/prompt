import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useEffect } from 'react'
import { CoursePhase, CoursePhaseType } from '../../../../interface/coursePhase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postCoursePhase } from '../../../../network/coursePhase'
import { Query } from '../../../../state/query'

interface CoursePhaseCreationModalProps {
  opened: boolean
  onClose: () => void
  nextSeqOrderNumber: number
}

export const CoursePhaseCreationModal = ({
  opened,
  onClose,
  nextSeqOrderNumber,
}: CoursePhaseCreationModalProps): JSX.Element => {
  const queryClient = useQueryClient()
  const form = useForm<CoursePhase>({
    initialValues: {
      id: '',
      name: '',
      type: CoursePhaseType.OTHER,
      sequentialOrder: nextSeqOrderNumber,
      checks: [],
    },
  })

  const createCoursePhase = useMutation({
    mutationFn: () => postCoursePhase(form.values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.COURSE_PHASE] })
      onClose()
    },
  })

  useEffect(() => {
    form.setValues({ ...form.values, sequentialOrder: nextSeqOrderNumber })
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [nextSeqOrderNumber])

  return (
    <Modal centered opened={opened} onClose={onClose}>
      <Stack>
        <TextInput
          withAsterisk
          required
          label='Name'
          placeholder='Name'
          {...form.getInputProps('name')}
        />
        <Group align='right'>
          <Button
            onClick={() => {
              createCoursePhase.mutate()
            }}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
