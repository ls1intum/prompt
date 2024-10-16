import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useState } from 'react'
import { CoursePhase, CoursePhaseCheck } from '../../../../interface/coursePhase'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postCoursePhaseCheck } from '../../../../network/coursePhase'
import { Query } from '../../../../state/query'

interface CoursePhaseCheckCreationModalProps {
  coursePhases: CoursePhase[]
  opened: boolean
  onClose: () => void
}

export const CoursePhaseCheckCreationModal = ({
  coursePhases,
  opened,
  onClose,
}: CoursePhaseCheckCreationModalProps): JSX.Element => {
  const queryClient = useQueryClient()
  const [selectedCoursePhaseId, setSelectedCoursePhaseId] = useState<string | null>()
  const form = useForm<CoursePhaseCheck>({
    initialValues: {
      id: '',
      title: '',
      description: '',
      sequentialOrder: 0,
    },
  })

  const createCoursePhaseCheck = useMutation({
    mutationFn: () =>
      postCoursePhaseCheck(selectedCoursePhaseId ?? '', {
        ...form.values,
        sequentialOrder:
          coursePhases.filter((coursePhase) => coursePhase.id === selectedCoursePhaseId).at(0)
            ?.checks.length ?? 0,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.COURSE_PHASE] })
      form.reset()
      onClose()
    },
  })

  return (
    <Modal centered opened={opened} onClose={onClose}>
      <Stack>
        <Select
          withAsterisk
          required
          label='Course Phase'
          placeholder='Course phase'
          data={coursePhases.map((coursePhase) => {
            return { value: coursePhase.id, label: coursePhase.name }
          })}
          value={selectedCoursePhaseId}
          onChange={(value) => {
            setSelectedCoursePhaseId(value)
          }}
        />
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
        <Group align='center'>
          <Button
            onClick={() => {
              if (selectedCoursePhaseId) {
                createCoursePhaseCheck.mutate()
              }
            }}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
