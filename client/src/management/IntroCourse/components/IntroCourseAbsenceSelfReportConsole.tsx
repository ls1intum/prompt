import { Button, Card, Divider, Group, Modal, Stack, Text } from '@mantine/core'
import { IntroCourseAbsence } from '../../../interface/introCourse'
import { Student } from '../../../interface/application'
import moment from 'moment'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  postIntroCourseAbsenceReportAcceptance,
  postIntroCourseAbsenceReportRejection,
} from '../../../network/introCourse'
import { Query } from '../../../state/query'
import { useAutoAnimate } from '@formkit/auto-animate/react'

interface IntroCourseAbsenceSelfReportConsoleProps {
  opened: boolean
  onClose: () => void
  introCourseAbsenceSelfReports: (IntroCourseAbsence & { student: Student })[]
}

export const IntroCourseAbsenceSelfReportConsole = ({
  opened,
  onClose,
  introCourseAbsenceSelfReports,
}: IntroCourseAbsenceSelfReportConsoleProps): JSX.Element => {
  const queryClient = useQueryClient()
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()

  const acceptIntroCourseAbsenceReport = useMutation({
    mutationFn: (introCourseAbsenceId: string) =>
      postIntroCourseAbsenceReportAcceptance(introCourseAbsenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE_PARTICIPATIONS] })
    },
  })

  const rejectIntroCourseAbsenceReport = useMutation({
    mutationFn: (introCourseAbsenceId: string) =>
      postIntroCourseAbsenceReportRejection(introCourseAbsenceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE_PARTICIPATIONS] })
    },
  })

  return (
    <Modal
      centered
      opened={opened}
      onClose={onClose}
      size='70%'
      title={
        <Text fz='sm' c='dimmed'>
          Pending Intro Course Absence Self Reports
        </Text>
      }
    >
      <Stack ref={bodyRef}>
        {introCourseAbsenceSelfReports
          .sort((a, b) => (moment(a.date).isAfter(moment(b.date)) ? 1 : -1))
          .map((introCourseAbsenceSelfReport) => (
            <Card shadow='sm' withBorder key={introCourseAbsenceSelfReport.id}>
              <Group justify='space-between'>
                <Stack>
                  <Text fz='sm' fw={500}>{`${
                    introCourseAbsenceSelfReport.student.firstName ?? ''
                  } ${introCourseAbsenceSelfReport.student.lastName ?? ''}`}</Text>
                  <Divider />
                  <Text fz='sm'>
                    <Text fz='sm' c='dimmed' fw={500}>
                      Absent on:{' '}
                    </Text>
                    {`${moment(introCourseAbsenceSelfReport.date).format('dddd, DD. MMMM YYYY')}`}
                  </Text>
                  <Text fz='sm'>
                    <Text fz='sm' c='dimmed' fw={500}>
                      Excuse:{' '}
                    </Text>
                    {introCourseAbsenceSelfReport.excuse}
                  </Text>
                </Stack>
                <Group justify='flex-end'>
                  <Button
                    color='red'
                    variant='outline'
                    onClick={() =>
                      rejectIntroCourseAbsenceReport.mutate(introCourseAbsenceSelfReport.id)
                    }
                  >
                    Reject
                  </Button>
                  <Button
                    color='green'
                    onClick={() =>
                      acceptIntroCourseAbsenceReport.mutate(introCourseAbsenceSelfReport.id)
                    }
                  >
                    Approve
                  </Button>
                </Group>
              </Group>
            </Card>
          ))}
      </Stack>
    </Modal>
  )
}
