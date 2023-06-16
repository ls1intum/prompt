import { Button, Group, Modal, Select, Stack, TextInput } from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  type CoursePhase,
  type CoursePhaseCheck,
} from '../../../../redux/coursePhasesSlice/coursePhasesSlice'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../../redux/store'
import { createCoursePhaseCheck } from '../../../../redux/coursePhasesSlice/thunks/createCoursePhaseCheck'
import { useState } from 'react'

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
  const dispatch = useDispatch<AppDispatch>()
  const [selectedCoursePhaseId, setSelectedCoursePhaseId] = useState<string | null>()
  const form = useForm<CoursePhaseCheck>({
    initialValues: {
      id: '',
      title: '',
      description: '',
      sequentialOrder: 0,
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
        <Group position='center'>
          <Button
            onClick={() => {
              if (selectedCoursePhaseId) {
                void dispatch(
                  createCoursePhaseCheck({
                    coursePhaseId: selectedCoursePhaseId,
                    coursePhaseCheck: {
                      ...form.values,
                      sequentialOrder:
                        coursePhases
                          .filter((coursePhase) => coursePhase.id === selectedCoursePhaseId)
                          .at(0)?.checks.length ?? 0,
                    },
                  }),
                )
                form.reset()
                onClose()
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
