import { useState, useEffect } from 'react'
import { Button, Center, Modal, Pagination, Paper, Stack, TextInput, Title } from '@mantine/core'
import { useForm } from '@mantine/form'
import { useDispatch } from 'react-redux'
import { fetchAllApplicationSemesters } from '../redux/applicationSemesterSlice/thunks/fetchApplicationSemesters'
import { type AppDispatch, useAppSelector } from '../redux/store'
import {
  type ApplicationSemester,
  type ApplicationSemesterRequest,
  setCurrentState,
} from '../redux/applicationSemesterSlice/applicationSemesterSlice'
import { createApplicationSemester } from '../redux/applicationSemesterSlice/thunks/createApplicationSemester'
import { DatePickerInput } from '@mantine/dates'
import { IconCalendar } from '@tabler/icons-react'

interface WorkspaceCreationModalProps {
  opened: boolean
  onClose: () => void
}

export const WorkspaceCreationModal = ({
  opened,
  onClose,
}: WorkspaceCreationModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const form = useForm<ApplicationSemesterRequest>({
    initialValues: {
      semesterName: '',
      applicationPeriodStart: new Date(),
      applicationPeriodEnd: new Date(),
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
              void dispatch(createApplicationSemester(form.values))
              form.reset()
              onClose()
            }}
          >
            Create
          </Button>
        </Stack>
      </Center>
    </Modal>
  )
}

export const WorkspaceSelectionDialog = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const fetchedApplicationSemesters = useAppSelector(
    (state) => state.applicationSemester.applicationSemesters,
  )
  const [applicationSemesters, setApplicationSemesters] = useState<ApplicationSemester[] | []>([])
  const [workspaceCreationModalOpen, setWorkspaceCreationModalOpen] = useState(false)
  const [page, setPage] = useState(1)
  const [pageSize] = useState(5)

  useEffect(() => {
    void dispatch(fetchAllApplicationSemesters())
  }, [])

  useEffect(() => {
    if (fetchAllApplicationSemesters.length > 0) {
      setApplicationSemesters(fetchedApplicationSemesters)
    }
  }, [fetchedApplicationSemesters])

  return (
    <div style={{ paddingTop: '10vh' }}>
      <WorkspaceCreationModal
        opened={workspaceCreationModalOpen}
        onClose={() => {
          setWorkspaceCreationModalOpen(false)
        }}
      />
      <Center>
        <Title order={3}>Please select a workspace</Title>
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
            {applicationSemesters
              .slice((page - 1) * pageSize, (page - 1) * pageSize + pageSize)
              .map((applicationSemester) => (
                <Button
                  variant='outline'
                  key={applicationSemester.id}
                  onClick={() => {
                    dispatch(setCurrentState(applicationSemester))
                  }}
                >
                  {applicationSemester.semesterName}
                </Button>
              ))}
          </Stack>
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <Pagination
              value={page}
              onChange={setPage}
              total={applicationSemesters.length > 0 ? applicationSemesters.length / pageSize : 1}
            />
          </div>
        </Paper>
      </div>
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
