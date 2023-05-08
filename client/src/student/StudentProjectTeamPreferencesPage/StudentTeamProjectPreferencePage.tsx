import { useListState } from '@mantine/hooks'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  type ClassAttributes,
  type HTMLAttributes,
  type LegacyRef,
  type ReactElement,
  type JSXElementConstructor,
  type ReactFragment,
  type ReactPortal,
  useEffect,
  useState,
} from 'react'
import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import { fetchProjectTeams } from '../../redux/projectTeamsSlice/thunks/fetchProjectTeams'
import {
  Button,
  Center,
  Container,
  Group,
  Stack,
  Text,
  TextInput,
  Title,
  createStyles,
  rem,
} from '@mantine/core'
import { type ProjectTeam } from '../../redux/projectTeamsSlice/projectTeamsSlice'
import { ProjectTeamPreferencesSubmissionCodeModal } from './components/ProjectTeamPreferencesSubmissionCodeModal'
import { useParams } from 'react-router-dom'
import { createStudentProjectTeamPreferences } from '../../redux/studentProjectTeamPreferencesSlice/thunks/createStudentProjectTeamPreferences'
import { fetchApplicationSemestersWithOpenApplicationPeriod } from '../../redux/applicationSemesterSlice/thunks/fetchApplicationSemesters'
import { isNotEmpty, useForm } from '@mantine/form'

const useStyles = createStyles((theme) => ({
  item: {
    ...theme.fn.focusStyles(),
    display: 'flex',
    alignItems: 'center',
    borderRadius: theme.radius.md,
    border: `${rem(1)} solid ${
      theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.gray[2]
    }`,
    padding: `${theme.spacing.sm} ${theme.spacing.xl}`,
    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.white,
    marginBottom: theme.spacing.sm,
  },

  itemDragging: {
    boxShadow: theme.shadows.sm,
  },
}))

export const StudentTeamProjectPreferencePage = (): JSX.Element => {
  const { classes, cx } = useStyles()
  const { studentId } = useParams()
  const openApplicationSemester = useAppSelector(
    (state) => state.applicationSemester.openApplicationSemester,
  )
  const projectTeams = useAppSelector((state) => state.projectTeams.projectTeams)
  const dispatch = useDispatch<AppDispatch>()
  const [state, handlers] = useListState<ProjectTeam>([])
  const [submissionCodeModalOpen, setSubmissionCodeModalOpen] = useState(false)
  const [submissionCode, setSubmissionCode] = useState('')
  const form = useForm({
    initialValues: {
      appleId: '',
      macBookDeviceId: '',
      iPhoneDeviceId: '',
      iPadDeviceId: '',
      appleWatchDeviceId: '',
    },
    validate: {
      appleId: isNotEmpty('Please provide a valid Apple ID.'),
    },
    validateInputOnChange: true,
  })

  useEffect(() => {
    void dispatch(fetchApplicationSemestersWithOpenApplicationPeriod())
  }, [])

  useEffect(() => {
    if (openApplicationSemester) {
      void dispatch(fetchProjectTeams(openApplicationSemester.semesterName))
    }
  }, [openApplicationSemester])

  useEffect(() => {
    handlers.setState(projectTeams)
  }, [projectTeams])

  const items = state.map((item, index) => (
    <Draggable key={item.id.toString()} index={index} draggableId={item.id.toString()}>
      {(
        provided: {
          draggableProps: JSX.IntrinsicAttributes &
            ClassAttributes<HTMLDivElement> &
            HTMLAttributes<HTMLDivElement>
          dragHandleProps: JSX.IntrinsicAttributes &
            ClassAttributes<HTMLDivElement> &
            HTMLAttributes<HTMLDivElement>
          innerRef: LegacyRef<HTMLDivElement> | undefined
        },
        snapshot: any,
      ) => (
        <div
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          ref={provided.innerRef}
          className={cx(classes.item, { [classes.itemDragging]: snapshot.isDragging })}
        >
          <Group>
            <Text>{index + 1}</Text>
            <Text color='dimmed' size='sm'>
              {item.customer}
            </Text>
          </Group>
        </div>
      )}
    </Draggable>
  ))

  return (
    <div style={{ margin: '5vh' }}>
      <ProjectTeamPreferencesSubmissionCodeModal
        open={submissionCodeModalOpen}
        onClose={() => {
          setSubmissionCodeModalOpen(false)
        }}
        onSubmit={setSubmissionCode}
      />
      <Center style={{ display: 'flex', flexDirection: 'column', gap: '3vh' }}>
        <Title order={2}>Project Team Preferences</Title>
      </Center>
      <Container size='50vw' style={{ padding: '3vh' }}>
        <Stack style={{ paddingBottom: '5vh' }}>
          <TextInput
            label='Apple ID'
            placeholder='Apple ID'
            required
            {...form.getInputProps('appleId')}
          />
          <Group grow>
            <TextInput
              label='MacBook Device ID'
              placeholder='MacBook Device ID'
              {...form.getInputProps('macBookDeviceId')}
            />
            <TextInput
              label='iPhone Device ID'
              placeholder='iPhone Device ID'
              {...form.getInputProps('iPhoneDeviceId')}
            />
          </Group>
          <Group grow>
            <TextInput
              label='iPad Device ID'
              placeholder='iPad Device ID'
              {...form.getInputProps('iPadDeviceId')}
            />
            <TextInput
              label='Apple Watch Device ID'
              placeholder='Apple Watch Device ID'
              {...form.getInputProps('appleWatchDeviceId')}
            />
          </Group>
        </Stack>
        <DragDropContext
          onDragEnd={({ destination, source }: any) => {
            handlers.reorder({ from: source.index, to: destination?.index || 0 })
          }}
        >
          <Droppable droppableId='dnd-list' direction='vertical'>
            {(provided: {
              droppableProps: JSX.IntrinsicAttributes &
                ClassAttributes<HTMLDivElement> &
                HTMLAttributes<HTMLDivElement>
              innerRef: LegacyRef<HTMLDivElement> | undefined
              placeholder:
                | string
                | number
                | boolean
                | ReactElement<any, string | JSXElementConstructor<any>>
                | ReactFragment
                | ReactPortal
                | null
                | undefined
            }) => (
              <div {...provided.droppableProps} ref={provided.innerRef}>
                {items}
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      </Container>
      <Center>
        <Button
          variant='filled'
          disabled={!openApplicationSemester || !form.isValid()}
          onClick={() => {
            if (submissionCode) {
              if (studentId) {
                const preferencesMap = new Map()
                state.forEach((preference, index) => {
                  preferencesMap.set(preference.id, index)
                })

                if (openApplicationSemester) {
                  void dispatch(
                    createStudentProjectTeamPreferences({
                      appleId: form.values.appleId,
                      studentId,
                      applicationSemesterId: openApplicationSemester.id,
                      studentProjectTeamPreferences: state.map((projectTeam, priorityScore) => {
                        return {
                          projectTeamId: projectTeam.id,
                          priorityScore,
                        }
                      }),
                    }),
                  )
                }
              }
            } else {
              setSubmissionCodeModalOpen(true)
            }
          }}
        >
          Submit
        </Button>
      </Center>
    </div>
  )
}
