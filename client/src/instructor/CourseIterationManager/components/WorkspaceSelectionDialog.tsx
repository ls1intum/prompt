import { useState, useEffect } from 'react'
import {
  Button,
  Center,
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
import { fetchAllCourseIterations } from '../../../redux/courseIterationSlice/thunks/fetchAllCourseIterations'
import { type AppDispatch, useAppSelector } from '../../../redux/store'
import {
  type CourseIteration,
  setCurrentState,
} from '../../../redux/courseIterationSlice/courseIterationSlice'
import { createCourseIteration } from '../../../redux/courseIterationSlice/thunks/createCourseIteration'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'
import { updateCourseIteration } from '../../../redux/courseIterationSlice/thunks/updateCourseIteration'
import { type Patch } from '../../../service/configService'

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
          applicationPeriodStart: new Date(courseIteration.applicationPeriodStart),
          applicationPeriodEnd: new Date(courseIteration.applicationPeriodEnd),
        }
      : {
          id: '',
          semesterName: '',
          applicationPeriodStart: new Date(),
          applicationPeriodEnd: new Date(),
          iosTag: '',
          phases: [],
        },
  })

  return (
    <Modal opened={opened} onClose={onClose} title='Create new workspace' centered>
      <Center>
        <Stack style={{ width: '50vw', height: '60vh', display: 'flex', justifyContent: 'center' }}>
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
          <DatePickerInput
            icon={<IconCalendar />}
            label='Application Period Start'
            {...form.getInputProps('applicationPeriodStart')}
          />
          <DatePickerInput
            icon={<IconCalendar />}
            label='Application Period End'
            {...form.getInputProps('applicationPeriodEnd')}
          />
          <Button
            variant='filled'
            onClick={() => {
              if (courseIteration) {
                const courseIterationPatchObjectArray: Patch[] = []
                Object.keys(form.values).forEach((key) => {
                  const courseIterationPatchObject = new Map()
                  courseIterationPatchObject.set('op', 'replace')
                  courseIterationPatchObject.set('path', '/' + key)
                  courseIterationPatchObject.set('value', form.getInputProps(key).value)
                  const obj = Object.fromEntries(courseIterationPatchObject)
                  courseIterationPatchObjectArray.push(obj)
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
