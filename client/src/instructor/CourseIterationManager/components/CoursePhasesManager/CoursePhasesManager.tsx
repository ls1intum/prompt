import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import { useEffect, useState } from 'react'
import { fetchAllCoursePhases } from '../../../../redux/coursePhasesSlice/thunks/fetchAllCoursePhases'
import { Accordion, ActionIcon, Button, Group, Paper, Stack, Text } from '@mantine/core'
import { CoursePhaseCheckCreationModal } from './CoursePhaseCheckCreationModal'
import { IconX } from '@tabler/icons-react'
import { deleteCoursePhaseCheck } from '../../../../redux/coursePhasesSlice/thunks/deleteCoursePhaseCheck'
import {
  type CoursePhase,
  type CoursePhaseCheck,
} from '../../../../redux/coursePhasesSlice/coursePhasesSlice'
import { CoursePhaseCheckDeletionConfirmationModal } from './CoursePhaseCheckDeletionConfirmationModal'

export const CoursePhasesManager = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const coursePhases = useAppSelector((state) => state.coursePhases.coursePhases)
  const [coursePhaseCheckToDelete, setCoursePhaseCheckToDelete] = useState<
    CoursePhaseCheck | undefined
  >()
  const [coursePhaseCheckCreationModalOpened, setCoursePhaseCheckCreationModalOpened] =
    useState(false)
  const [
    coursePhaseCheckDeletionConfirmationModalOpened,
    setCoursePhaseCheckDeletionConfirmationModalOpened,
  ] = useState(false)
  const [selectedCoursePhase, setSelectedCoursePhase] = useState<CoursePhase | undefined>()

  useEffect(() => {
    void dispatch(fetchAllCoursePhases())
  }, [])

  return (
    <div style={{ padding: '5vh 0', gap: '3vh', display: 'flex', flexDirection: 'column' }}>
      <CoursePhaseCheckCreationModal
        coursePhases={coursePhases}
        opened={coursePhaseCheckCreationModalOpened}
        onClose={() => {
          setCoursePhaseCheckCreationModalOpened(false)
        }}
      />
      {coursePhaseCheckToDelete && selectedCoursePhase && (
        <CoursePhaseCheckDeletionConfirmationModal
          coursePhaseCheck={coursePhaseCheckToDelete}
          opened={coursePhaseCheckDeletionConfirmationModalOpened}
          onClose={() => {
            setCoursePhaseCheckDeletionConfirmationModalOpened(false)
          }}
          onConfirm={() => {
            void dispatch(
              deleteCoursePhaseCheck({
                coursePhaseId: selectedCoursePhase.id,
                coursePhaseCheckId: coursePhaseCheckToDelete.id,
              }),
            )
            setCoursePhaseCheckDeletionConfirmationModalOpened(false)
          }}
        />
      )}
      <Group position='right'>
        <Button
          onClick={() => {
            setCoursePhaseCheckCreationModalOpened(true)
          }}
        >
          Add Phase Check
        </Button>
      </Group>
      <Accordion>
        {[...coursePhases]
          .sort((a, b) => a.sequentialOrder - b.sequentialOrder)
          .map((coursePhase) => (
            <Accordion.Item value={coursePhase.name} key={coursePhase.id}>
              <Accordion.Control>
                <Text fw={500}>{coursePhase.name}</Text>
              </Accordion.Control>
              <Accordion.Panel>
                <Stack>
                  {coursePhase.checks.length > 0 ? (
                    [...coursePhase.checks]
                      .sort((a, b) => a.sequentialOrder - b.sequentialOrder)
                      .map((check) => (
                        <Paper shadow='md' key={check.id} p='md'>
                          <Group style={{ alignItems: 'center', justifyContent: 'space-between' }}>
                            <Stack spacing='xs'>
                              <Text>
                                {check.sequentialOrder + 1}. {check.title}
                              </Text>
                              <Text c='dimmed' fz='sm'>
                                {check.description}
                              </Text>
                            </Stack>
                            <ActionIcon
                              onClick={() => {
                                setSelectedCoursePhase(coursePhase)
                                setCoursePhaseCheckToDelete(check)
                                setCoursePhaseCheckDeletionConfirmationModalOpened(true)
                              }}
                            >
                              <IconX />
                            </ActionIcon>
                          </Group>
                        </Paper>
                      ))
                  ) : (
                    <Text c='dimmed'>No course phase checks found.</Text>
                  )}
                </Stack>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
      </Accordion>
    </div>
  )
}
