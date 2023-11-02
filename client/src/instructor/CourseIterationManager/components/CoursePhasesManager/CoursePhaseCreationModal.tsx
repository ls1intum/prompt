import { Button, Group, Modal, Stack, TextInput } from '@mantine/core'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../../redux/store'
import { useForm } from '@mantine/form'
import {
  type CoursePhase,
  CoursePhaseType,
} from '../../../../redux/coursePhasesSlice/coursePhasesSlice'
import { createCoursePhase } from '../../../../redux/coursePhasesSlice/thunks/createCoursePhase'
import { useEffect } from 'react'

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
  const dispatch = useDispatch<AppDispatch>()
  const form = useForm<CoursePhase>({
    initialValues: {
      id: '',
      name: '',
      type: CoursePhaseType.OTHER,
      sequentialOrder: nextSeqOrderNumber,
      checks: [],
    },
  })

  useEffect(() => {
    form.setValues({ ...form.values, sequentialOrder: nextSeqOrderNumber })
  }, [form, nextSeqOrderNumber])

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
              void dispatch(createCoursePhase(form.values))
              onClose()
            }}
          >
            Submit
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
