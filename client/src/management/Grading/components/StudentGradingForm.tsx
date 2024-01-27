import { Button, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { type Grade, type Application } from '../../../redux/applicationsSlice/applicationsSlice'
import { useForm } from '@mantine/form'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../redux/store'
import { gradeDeveloperApplication } from '../../../redux/projectTeamsSlice/thunks/gradeDeveloperApplication'

interface StudentGradingFormProps {
  application: Application
}

export const StudentGradingForm = ({ application }: StudentGradingFormProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const form = useForm<Partial<Grade>>({
    initialValues: application.finalGrade
      ? {
          ...application.finalGrade,
        }
      : {
          id: '',
          grade: 0,
          comment: '',
        },
    validateInputOnChange: ['student.tumId'],
    validateInputOnBlur: true,
    validate: {
      comment: (value) => {
        if (value && value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
      },
    },
  })

  return (
    <Stack>
      <Text>{`${application.student.firstName} ${application.student.lastName}`}</Text>
      <TextInput
        onWheel={(e) => {
          e.currentTarget.blur()
        }}
        type='number'
        min={0}
        max={6}
        placeholder='Final grade'
        label='Final Grade'
        {...form.getInputProps('grade')}
      />
      <div>
        <Textarea
          label='Comment'
          autosize
          minRows={5}
          placeholder='Why do you want to participate in iPraktikum?'
          {...form.getInputProps('comment')}
        />
        {!form.errors.comment && (
          <Text fz='xs' ta='right'>{`${form.values.comment?.length ?? 0} / 500`}</Text>
        )}
      </div>
      <Button
        disabled={!form.isTouched() || !form.isDirty() || !form.isValid()}
        onClick={() => {
          void dispatch(
            gradeDeveloperApplication({
              applicationId: application.id,
              grade: form.values,
            }),
          )
          form.resetDirty()
          form.resetTouched()
        }}
      >
        Save
      </Button>
    </Stack>
  )
}
