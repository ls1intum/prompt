import { useState, useEffect } from 'react'
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
import { useDispatch } from 'react-redux'
import { fetchAllCourseIterations } from '../../../../redux/courseIterationSlice/thunks/fetchAllCourseIterations'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import {
  type CourseIteration,
  setCurrentState,
} from '../../../../redux/courseIterationSlice/courseIterationSlice'
import { createCourseIteration } from '../../../../redux/courseIterationSlice/thunks/createCourseIteration'
import { DatePickerInput, DateTimePicker } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'
import { updateCourseIteration } from '../../../../redux/courseIterationSlice/thunks/updateCourseIteration'
import { type Patch } from '../../../../service/configService'

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
  const dispatch = useDispatch<AppDispatch>()
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
          iosTag: '',
          phases: [],
        },
  })

  return (
    <Modal opened={opened} onClose={onClose} title='Create new workspace' centered size='auto'>
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
              icon={<IconCalendar />}
              label='Developer Application Period Start'
              {...form.getInputProps('developerApplicationPeriodStart')}
            />
            <DatePickerInput
              icon={<IconCalendar />}
              label='Developer Application Period End'
              {...form.getInputProps('developerApplicationPeriodEnd')}
            />
          </Group>
          <Divider />
          <Group grow>
            <DatePickerInput
              icon={<IconCalendar />}
              label='Coach Application Period Start'
              {...form.getInputProps('coachApplicationPeriodStart')}
            />
            <DatePickerInput
              icon={<IconCalendar />}
              label='Coach Application Period End'
              {...form.getInputProps('coachApplicationPeriodEnd')}
            />
          </Group>
          <DateTimePicker
            icon={<IconCalendar />}
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
              icon={<IconCalendar />}
              label='Tutor Application Period Start'
              {...form.getInputProps('tutorApplicationPeriodStart')}
            />
            <DatePickerInput
              icon={<IconCalendar />}
              label='Tutor Application Period End'
              {...form.getInputProps('tutorApplicationPeriodEnd')}
            />
          </Group>
          <DateTimePicker
            icon={<IconCalendar />}
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
                void dispatch(
                  updateCourseIteration({
                    courseIterationId: courseIteration.id.toString(),
                    courseIterationPatch: courseIterationPatchObjectArray,
                  }),
                )
              } else {
                void dispatch(createCourseIteration(form.values))
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
  const dispatch = useDispatch<AppDispatch>()
  const fetchedCourseIterations = useAppSelector((state) => state.courseIterations.courseIterations)
  const [courseIterations, setCourseIterations] = useState<CourseIteration[] | []>([])
  const [workspaceCreationModalOpen, setWorkspaceCreationModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)

  useEffect(() => {
    void dispatch(fetchAllCourseIterations())
  }, [])

  useEffect(() => {
    if (fetchAllCourseIterations.length > 0) {
      setCourseIterations(fetchedCourseIterations)
    }
  }, [fetchedCourseIterations])

  return (
    <div style={{ paddingTop: '10vh' }}>
      <CourseIterationCreationModal
        opened={workspaceCreationModalOpen}
        onClose={() => {
          setWorkspaceCreationModalOpen(false)
        }}
      />
      <Center>
        <Title order={3}>Please select a workspace</Title>
      </Center>
      {courseIterations.length > 0 ? (
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
                      dispatch(setCurrentState(courseIteration))
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
      ) : (
        <Center style={{ padding: '2vh' }}>
          <Text>No workspaces found.</Text>
        </Center>
      )}
      <Center>
        <Button
          variant='filled'
          onClick={() => {
            setWorkspaceCreationModalOpen(true)
          }}
        >
          Create new workspace
        </Button>
      </Center>
    </div>
  )
}
