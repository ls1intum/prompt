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
import { Button, Center, Container, Group, Text, Title, createStyles, rem } from '@mantine/core'
import { type ProjectTeam } from '../../redux/projectTeamsSlice/projectTeamsSlice'
import { ProjectTeamPreferencesSubmissionCodeModal } from './components/ProjectTeamPreferencesSubmissionCodeModal'
import { useParams } from 'react-router-dom'

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
  const selectedApplicationSemester = useAppSelector(
    (state) => state.applicationSemester.currentState,
  )
  const projectTeams = useAppSelector((state) => state.projectTeams.projectTeams)
  const dispatch = useDispatch<AppDispatch>()
  const [state, handlers] = useListState<ProjectTeam>([])
  const [submissionCodeModalOpen, setSubmissionCodeModalOpen] = useState(false)
  const [submissionCode, setSubmissionCode] = useState('')

  useEffect(() => {
    if (selectedApplicationSemester) {
      console.log('fetching')
      void dispatch(fetchProjectTeams(selectedApplicationSemester.semesterName))
    } else {
      void dispatch(fetchProjectTeams('SS2023'))
    }
  }, [selectedApplicationSemester])

  useEffect(() => {
    handlers.setState(projectTeams)
  }, [projectTeams])

  useEffect(() => {
    if (!submissionCode) {
      setSubmissionCodeModalOpen(true)
    }
  }, [submissionCode])

  useEffect(() => {
    console.log(state)
    console.log(studentId)
  }, [state])

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
        <Title>Project Priority List</Title>
        <Text>Please order the projects in descending order according to your preferences</Text>
      </Center>
      <Container size='50vw' style={{ padding: '3vh' }}>
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
          onClick={() => {
            if (studentId) {
              console.log(
                state.map((preference, index) => {
                  return {
                    studentId,
                    projectTeamId: preference.id,
                    applicationSemesterId: selectedApplicationSemester?.id ?? 'SS2024',
                    priorityScore: index,
                  }
                }),
              )
            }
          }}
        >
          Submit
        </Button>
      </Center>
    </div>
  )
}
