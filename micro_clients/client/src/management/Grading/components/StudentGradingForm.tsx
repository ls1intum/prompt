import { Button, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { type Grade, type Application } from '../../../interface/application'
import { useForm } from '@mantine/form'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postDeveloperApplicationGrade } from '../../../network/application'
import { Query } from '../../../state/query'

interface StudentGradingFormProps {
  application: Application
}

export const StudentGradingForm = ({ application }: StudentGradingFormProps): JSX.Element => {
  const queryClient = useQueryClient()
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

  const assignGrade = useMutation({
    mutationFn: () => postDeveloperApplicationGrade(application.id, form.values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.DEVELOPER_APPLICATION] })
    },
  })

  return (
    <Stack>
      <Text
        fw={500}
        ta='center'
      >{`${application.student.firstName} ${application.student.lastName}`}</Text>
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
          placeholder='Comment'
          {...form.getInputProps('comment')}
        />
        {!form.errors.comment && (
          <Text fz='xs' ta='right'>{`${form.values.comment?.length ?? 0} / 500`}</Text>
        )}
      </div>
      <Button
        disabled={!form.isTouched() || !form.isDirty() || !form.isValid()}
        onClick={() => {
          assignGrade.mutate()
          form.resetDirty()
          form.resetTouched()
        }}
      >
        Save
      </Button>
    </Stack>
  )
}
