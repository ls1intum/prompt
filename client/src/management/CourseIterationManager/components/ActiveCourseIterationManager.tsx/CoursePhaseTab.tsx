import { Checkbox, Group, Paper, Stack, Text } from '@mantine/core'
import { useMutation, useQueryClient } from 'react-query'
import { Query } from '../../../../state/query'
import { CourseIterationPhase } from '../../../../interface/courseIteration'
import { toggleCourseIterationPhaseCheckEntry } from '../../../../network/courseIteration'

interface CoursePhaseTabProps {
  courseIterationId: string
  courseIterationPhase: CourseIterationPhase
}

export const CoursePhaseTab = ({
  courseIterationId,
  courseIterationPhase,
}: CoursePhaseTabProps): JSX.Element => {
  const queryClient = useQueryClient()

  const deActivateCourseIterationPhaseCheckEntry = useMutation({
    mutationFn: (courseIterationPhaseCheckEntryId: string) => {
      return toggleCourseIterationPhaseCheckEntry(
        courseIterationId,
        courseIterationPhaseCheckEntryId,
      )
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.COURSE_ITERATION] })
    },
  })

  return (
    <Stack style={{ padding: '0 5vw' }}>
      {courseIterationPhase.checkEntries.length > 0 ? (
        [...courseIterationPhase.checkEntries]
          .sort((a, b) => a.coursePhaseCheck.sequentialOrder - b.coursePhaseCheck.sequentialOrder)
          .map((checkEntry) => (
            <Paper shadow='md' p='md' style={{ width: '50vw' }} key={checkEntry.id}>
              <Stack gap='xs'>
                <Group
                  style={{
                    alignItems: 'center',
                    justifyContent: 'space-between',
                  }}
                >
                  <Stack>
                    <Text>
                      {checkEntry.coursePhaseCheck.sequentialOrder + 1}.{' '}
                      {checkEntry.coursePhaseCheck.title}
                    </Text>
                    <Text c='dimmed' fz='sm'>
                      {checkEntry.coursePhaseCheck.description}
                    </Text>
                  </Stack>
                  <Checkbox
                    mt='md'
                    checked={checkEntry.fulfilled}
                    onChange={() => {
                      deActivateCourseIterationPhaseCheckEntry.mutate(checkEntry.id)
                    }}
                  />
                </Group>
              </Stack>
            </Paper>
          ))
      ) : (
        <Group align='center'>
          <Text c='dimmed'>No course phase checks found.</Text>
        </Group>
      )}
    </Stack>
  )
}
