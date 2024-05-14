import { useState } from 'react'
import {
  Button,
  Center,
  Divider,
  Group,
  Modal,
  Pagination,
  Paper,
  Stack,
  Text,
  TextInput,
  Title,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import { DatePickerInput, DateTimePicker } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'
import { type Patch } from '../../../../network/configService'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { patchCourseIteration, postCourseIteration } from '../../../../network/courseIteration'
import { Query } from '../../../../state/query'
import { CourseIteration } from '../../../../interface/courseIteration'
import { useCourseIterationStore } from '../../../../state/zustand/useCourseIterationStore'

interface CourseIterationCreationModalProps {
  opened: boolean
  onClose: () => void
  courseIteration?: CourseIteration
}

export const CourseIterationCreationModal = ({
  opened,
  onClose,
  courseIteration,
}: CourseIterationCreationModalProps): JSX.Element => {
  const queryClient = useQueryClient()
  const form = useForm<CourseIteration>({
    initialValues: courseIteration
      ? {
          ...courseIteration,
          developerApplicationPeriodStart: new Date(
            courseIteration.developerApplicationPeriodStart,
          ),
          developerApplicationPeriodEnd: new Date(courseIteration.developerApplicationPeriodEnd),
          coachApplicationPeriodStart: new Date(courseIteration.coachApplicationPeriodStart),
          coachApplicationPeriodEnd: new Date(courseIteration.coachApplicationPeriodEnd),
          tutorApplicationPeriodStart: new Date(courseIteration.tutorApplicationPeriodStart),
          tutorApplicationPeriodEnd: new Date(courseIteration.tutorApplicationPeriodEnd),
          coachInterviewDate: new Date(courseIteration.coachInterviewDate),
          tutorInterviewDate: new Date(courseIteration.tutorInterviewDate),
          introCourseStart: new Date(courseIteration.introCourseStart),
          introCourseEnd: new Date(courseIteration.introCourseEnd),
          kickoffSubmissionPeriodStart: new Date(courseIteration.kickoffSubmissionPeriodStart),
          kickoffSubmissionPeriodEnd: new Date(courseIteration.kickoffSubmissionPeriodEnd),
        }
      : {
          id: '',
          semesterName: '',
          coachInterviewPlannerLink: '',
          tutorInterviewPlannerLink: '',
          coachInterviewLocation: '',
          tutorInterviewLocation: '',
          developerApplicationPeriodStart: new Date(),
          developerApplicationPeriodEnd: new Date(),
          coachApplicationPeriodStart: new Date(),
          coachApplicationPeriodEnd: new Date(),
          tutorApplicationPeriodStart: new Date(),
          tutorApplicationPeriodEnd: new Date(),
          coachInterviewDate: new Date(),
          tutorInterviewDate: new Date(),
          introCourseStart: new Date(),
          introCourseEnd: new Date(),
          kickoffSubmissionPeriodStart: new Date(),
          kickoffSubmissionPeriodEnd: new Date(),
          iosTag: '',
          phases: [],
        },
  })

  const createCourseIteration = useMutation({
    mutationFn: (courseIteration: CourseIteration) => {
      return postCourseIteration(courseIteration)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.COURSE_ITERATION] })
    },
  })

  const updateCourseIteration = useMutation({
    mutationFn: (courseIterationPatch: Patch[]) => {
      return patchCourseIteration(courseIteration?.id ?? '', courseIterationPatch)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.COURSE_ITERATION] })
    },
  })

  return (
    <Modal opened={opened} onClose={onClose} centered size='auto'>
      <Center>
        <Stack
          style={{
            width: '50vw',
            margin: '5vh 3vw',
          }}
        >
          <TextInput
            withAsterisk
            label='Semester Name'
            placeholder='SS20XX'
            {...form.getInputProps('semesterName')}
          />
          <TextInput
            withAsterisk
            label='IOS Tag'
            placeholder='ss20XX'
            {...form.getInputProps('iosTag')}
          />
          <Group grow>
            <DatePickerInput
              leftSection={<IconCalendar />}
              label='Developer Application Period Start'
              {...form.getInputProps('developerApplicationPeriodStart')}
            />
            <DatePickerInput
              leftSection={<IconCalendar />}
              label='Developer Application Period End'
              {...form.getInputProps('developerApplicationPeriodEnd')}
            />
          </Group>
          <Divider />
          <Group grow>
            <DatePickerInput
              leftSection={<IconCalendar />}
              label='Coach Application Period Start'
              {...form.getInputProps('coachApplicationPeriodStart')}
            />
            <DatePickerInput
              leftSection={<IconCalendar />}
              label='Coach Application Period End'
              {...form.getInputProps('coachApplicationPeriodEnd')}
            />
          </Group>
          <DateTimePicker
            leftSection={<IconCalendar />}
            withAsterisk
            label='Coach Interview Date'
            {...form.getInputProps('coachInterviewDate')}
          />
          <TextInput
            withAsterisk
            label='Coach Interview Planner Link'
            {...form.getInputProps('coachInterviewPlannerLink')}
          />
          <TextInput
            withAsterisk
            label='Coach Interview Location'
            {...form.getInputProps('coachInterviewLocation')}
          />
          <Divider />
          <Group grow>
            <DatePickerInput
              leftSection={<IconCalendar />}
              label='Tutor Application Period Start'
              {...form.getInputProps('tutorApplicationPeriodStart')}
            />
            <DatePickerInput
              leftSection={<IconCalendar />}
              label='Tutor Application Period End'
              {...form.getInputProps('tutorApplicationPeriodEnd')}
            />
          </Group>
          <DateTimePicker
            leftSection={<IconCalendar />}
            withAsterisk
            label='Tutor Interview Date'
            {...form.getInputProps('tutorInterviewDate')}
          />
          <TextInput
            withAsterisk
            label='Tutor Interview Planner Link'
            {...form.getInputProps('tutorInterviewPlannerLink')}
          />
          <TextInput
            withAsterisk
            label='Tutor Interview Location'
            {...form.getInputProps('tutorInterviewLocation')}
          />
          <Divider />
          <Group grow>
            <DatePickerInput
              leftSection={<IconCalendar />}
              label='Intro Course Start'
              {...form.getInputProps('introCourseStart')}
            />
            <DatePickerInput
              leftSection={<IconCalendar />}
              label='Intro Course End'
              {...form.getInputProps('introCourseEnd')}
            />
          </Group>
          <Divider />
          <Group grow>
            <DatePickerInput
              leftSection={<IconCalendar />}
              label='Kickoff Submission Start'
              {...form.getInputProps('kickoffSubmissionPeriodStart')}
            />
            <DatePickerInput
              leftSection={<IconCalendar />}
              label='Kickoff Submission End'
              {...form.getInputProps('kickoffSubmissionPeriodEnd')}
            />
          </Group>
          <Button
            variant='filled'
            onClick={() => {
              if (courseIteration) {
                const courseIterationPatchObjectArray: Patch[] = []
                Object.keys(form.values).forEach((key) => {
                  if (form.isTouched(key)) {
                    const courseIterationPatchObject = new Map()
                    courseIterationPatchObject.set('op', 'replace')
                    courseIterationPatchObject.set('path', '/' + key)
                    courseIterationPatchObject.set('value', form.getInputProps(key).value)
                    const obj = Object.fromEntries(courseIterationPatchObject)
                    courseIterationPatchObjectArray.push(obj)
                  }
                })
                updateCourseIteration.mutate(courseIterationPatchObjectArray)
              } else {
                createCourseIteration.mutate(form.values)
              }
              form.reset()
              onClose()
            }}
          >
            Save
          </Button>
        </Stack>
      </Center>
    </Modal>
  )
}

export const WorkspaceSelectionDialog = (): JSX.Element => {
  const queryClient = useQueryClient()
  const { courseIterations, selectedCourseIteration, setSelectedCourseIteration } =
    useCourseIterationStore()
  const [workspaceCreationModalOpen, setWorkspaceCreationModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <Stack>
        <CourseIterationCreationModal
          opened={workspaceCreationModalOpen}
          onClose={() => {
            setWorkspaceCreationModalOpen(false)
          }}
        />
        {courseIterations.length > 0 ? (
          <>
            <Center>
              <Title order={3}>Please select a course iteration</Title>
            </Center>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                padding: '10vh 30vw',
              }}
            >
              <Paper
                style={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: '2vh',
                }}
              >
                <Stack>
                  {courseIterations
                    .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
                    .map((courseIteration) => (
                      <Button
                        variant='outline'
                        key={courseIteration.id}
                        onClick={() => {
                          const oldCourseIterationSemesterName =
                            selectedCourseIteration?.semesterName
                          setSelectedCourseIteration(courseIteration)
                          queryClient.invalidateQueries({
                            queryKey: [oldCourseIterationSemesterName],
                          })
                        }}
                      >
                        {courseIteration.semesterName}
                      </Button>
                    ))}
                </Stack>
                <div style={{ display: 'flex', justifyContent: 'center' }}>
                  <Pagination
                    value={page}
                    onChange={setPage}
                    total={courseIterations.length > 0 ? courseIterations.length / pageSize : 1}
                  />
                </div>
              </Paper>
            </div>
          </>
        ) : (
          <Center style={{ padding: '2vh' }}>
            <Text c='dimmed'>No course iterations found.</Text>
          </Center>
        )}
        <Center>
          <Button
            variant='filled'
            onClick={() => {
              setWorkspaceCreationModalOpen(true)
            }}
          >
            Create course iteration
          </Button>
        </Center>
      </Stack>
    </div>
  )
}
