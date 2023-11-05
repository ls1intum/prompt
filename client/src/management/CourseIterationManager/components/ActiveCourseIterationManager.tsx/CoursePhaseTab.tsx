import { Checkbox, Group, Paper, Stack, Text } from '@mantine/core'
import { type CourseIterationPhase } from '../../../../redux/courseIterationSlice/courseIterationSlice'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../../redux/store'
import { toggleCourseIterationPhaseCheckEntry } from '../../../../redux/courseIterationSlice/thunks/toggleCourseIterationPhaseCheckEntry'

interface CoursePhaseTabProps {
  courseIterationId: string
  courseIterationPhase: CourseIterationPhase
}

export const CoursePhaseTab = ({
  courseIterationId,
  courseIterationPhase,
}: CoursePhaseTabProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()

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
                      void dispatch(
                        toggleCourseIterationPhaseCheckEntry({
                          courseIterationId,
                          courseIterationPhaseCheckEntryId: checkEntry.id,
                        }),
                      )
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
