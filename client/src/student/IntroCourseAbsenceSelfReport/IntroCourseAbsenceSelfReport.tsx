import { Button, Group, Stack, Text, TextInput, Textarea } from '@mantine/core'
import { DatePickerInput } from '@mantine/dates'
import { isNotEmpty, useForm } from '@mantine/form'
import { IconCalendar } from '@tabler/icons-react'
import { useParams } from 'react-router-dom'
import { postIntroCourseAbsenceSelfReport } from '../../network/introCourse'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Query } from '../../state/query'
import { IntroCourseAbsenceReportStatus } from '../../interface/introCourse'
import { useAuthenticationStore } from '../../state/zustand/useAuthenticationStore'
import { useEffect } from 'react'

export const IntroCourseAbsenceSelfReport = (): JSX.Element => {
  const queryClient = useQueryClient()
  const { semesterName } = useParams()
  const { user } = useAuthenticationStore()
  const formInitialValues = {
    id: '',
    tumId: '',
    date: new Date(),
    excuse: '',
    selfReported: true,
    status: 'PENDING' as keyof typeof IntroCourseAbsenceReportStatus,
  }
  const introCourseAbsenceSelfReport = useForm({
    initialValues: {
      ...formInitialValues,
    },
    validate: {
      tumId: (value) =>
        /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{3}$/.test(value ?? '') ? null : 'This is not a valid TUM ID',
      date: isNotEmpty('Please select a date'),
      excuse: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please state an excuse for your absence on this day.'
        } else if (value.length > 255) {
          return 'The maximum allowed number of characters is 255.'
        }
      },
    },
  })

  useEffect(() => {
    if (user?.username) {
      introCourseAbsenceSelfReport.setFieldValue('tumId', user.username)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user])

  const createIntroCourseAbsenceSelfReport = useMutation({
    mutationFn: () =>
      postIntroCourseAbsenceSelfReport(
        semesterName ?? '',
        introCourseAbsenceSelfReport.values.tumId,
        introCourseAbsenceSelfReport.values,
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE_PARTICIPATIONS] })
      introCourseAbsenceSelfReport.reset()
    },
  })

  return (
    <Stack style={{ padding: '20vh 30vw', justifyContent: 'center' }}>
      <TextInput
        withAsterisk
        required
        disabled
        label='TUM ID'
        placeholder='TUM ID'
        {...introCourseAbsenceSelfReport.getInputProps('tumId')}
      />

      <DatePickerInput
        withAsterisk
        required
        leftSection={<IconCalendar />}
        label='Date'
        {...introCourseAbsenceSelfReport.getInputProps('date')}
      />
      <div>
        <Textarea
          autosize
          minRows={5}
          withAsterisk
          required
          label='Excuse'
          placeholder='Excuse'
          {...introCourseAbsenceSelfReport.getInputProps('excuse')}
        />
        {!introCourseAbsenceSelfReport.errors.excuse && (
          <Text fz='xs' ta='right'>{`${
            introCourseAbsenceSelfReport.values.excuse?.length ?? 0
          } / 255`}</Text>
        )}
      </div>
      <Group justify='flex-end'>
        <Button
          disabled={
            !introCourseAbsenceSelfReport.isValid() || !introCourseAbsenceSelfReport.isDirty()
          }
          onClick={() => {
            createIntroCourseAbsenceSelfReport.mutate()
          }}
        >
          Save
        </Button>
      </Group>
    </Stack>
  )
}
