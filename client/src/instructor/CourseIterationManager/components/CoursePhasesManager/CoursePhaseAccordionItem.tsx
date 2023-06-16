import {
  ActionIcon,
  Button,
  Collapse,
  Group,
  Paper,
  Stack,
  Text,
  createStyles,
} from '@mantine/core'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import { IconArrowDown, IconArrowUp, IconDeviceFloppy, IconTrash, IconX } from '@tabler/icons-react'
import {
  type CoursePhase,
  type CoursePhaseCheck,
} from '../../../../redux/coursePhasesSlice/coursePhasesSlice'
import { useDispatch } from 'react-redux'
import {
  type ClassAttributes,
  type HTMLAttributes,
  type LegacyRef,
  type ReactElement,
  type JSXElementConstructor,
  type ReactFragment,
  type ReactPortal,
  useState,
  useEffect,
} from 'react'
import { type AppDispatch } from '../../../../redux/store'
import { deleteCoursePhaseCheck } from '../../../../redux/coursePhasesSlice/thunks/deleteCoursePhaseCheck'
import { useListState } from '@mantine/hooks'
import { updateCoursePhaseCheckOrdering } from '../../../../redux/coursePhasesSlice/thunks/updateCoursePhaseCheckOrdering'
import { DeletionConfirmationModal } from '../../../../utilities/DeletionConfirmationModal'
import { deleteCoursePhase } from '../../../../redux/coursePhasesSlice/thunks/deleteCoursePhase'

const useStyles = createStyles((theme) => ({
  itemDragging: {
    boxShadow: theme.shadows.sm,
  },
}))

interface CoursePhaseAccordionItemProps {
  coursePhase: CoursePhase
}

export const CoursePhaseAccordionItem = ({
  coursePhase,
}: CoursePhaseAccordionItemProps): JSX.Element => {
  const { classes, cx } = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const [expanded, setExpanded] = useState(false)
  const [state, handlers] = useListState<CoursePhaseCheck>(coursePhase.checks)
  const [coursePhaseCheckToDelete, setCoursePhaseCheckToDelete] = useState<
    CoursePhaseCheck | undefined
  >()
  const [
    coursePhaseCheckDeletionConfirmationModalOpened,
    setCoursePhaseCheckDeletionConfirmationModalOpened,
  ] = useState(false)
  const [
    coursePhaseDeletionConfirmationModalOpened,
    setCoursePhaseDeletionConfirmationModalOpened,
  ] = useState(false)
  const [coursePhaseChecksReordered, setCoursePhaseChecksReordered] = useState(false)

  useEffect(() => {
    handlers.setState([...coursePhase.checks].sort((a, b) => a.sequentialOrder - b.sequentialOrder))
  }, [coursePhase])

  const coursePhaseChecks = state.map((coursePhaseCheck, index) => (
    <Draggable
      key={coursePhaseCheck.id.toString()}
      index={index}
      draggableId={coursePhaseCheck.id.toString()}
    >
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
          className={cx({ [classes.itemDragging]: snapshot.isDragging })}
        >
          <Paper shadow='md' key={coursePhaseCheck.id} p='md'>
            <Group style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Stack spacing='xs'>
                <Text>
                  {index + 1}. {coursePhaseCheck.title}
                </Text>
                <Text c='dimmed' fz='sm'>
                  {coursePhaseCheck.description}
                </Text>
              </Stack>
              <ActionIcon
                onClick={() => {
                  setCoursePhaseCheckToDelete(coursePhaseCheck)
                  setCoursePhaseCheckDeletionConfirmationModalOpened(true)
                }}
              >
                <IconX />
              </ActionIcon>
            </Group>
          </Paper>
        </div>
      )}
    </Draggable>
  ))

  return (
    <div style={{ display: 'flex', flexDirection: 'column' }}>
      {coursePhaseCheckToDelete && (
        <DeletionConfirmationModal
          title='Confirm Course Phase Check Deletion'
          text={`Are You sure You want to delete the course phase check '${coursePhaseCheckToDelete.title}'?`}
          opened={coursePhaseCheckDeletionConfirmationModalOpened}
          onClose={() => {
            setCoursePhaseCheckDeletionConfirmationModalOpened(false)
          }}
          onConfirm={() => {
            void dispatch(
              deleteCoursePhaseCheck({
                coursePhaseId: coursePhase.id,
                coursePhaseCheckId: coursePhaseCheckToDelete.id,
              }),
            )
            setCoursePhaseCheckDeletionConfirmationModalOpened(false)
          }}
        />
      )}
      <DeletionConfirmationModal
        title='Confirm Course Phase Deletion'
        text={`Are You sure You want to delete the course phase '${coursePhase.name}'?`}
        opened={coursePhaseDeletionConfirmationModalOpened}
        onClose={() => {
          setCoursePhaseDeletionConfirmationModalOpened(false)
        }}
        onConfirm={() => {
          void dispatch(deleteCoursePhase(coursePhase.id))
          setCoursePhaseDeletionConfirmationModalOpened(false)
        }}
      />
      <Paper
        onClick={() => {
          setExpanded(!expanded)
        }}
        shadow='md'
        p='md'
        style={{ width: '100%' }}
      >
        <Group style={{ justifyContent: 'space-between' }}>
          <Text fw={500}>{coursePhase.name}</Text>
          <ActionIcon>{expanded ? <IconArrowUp /> : <IconArrowDown />}</ActionIcon>
        </Group>
      </Paper>
      <Collapse in={expanded}>
        <Stack>
          {coursePhase.checks.length > 0 ? (
            <DragDropContext
              onDragEnd={({ destination, source }: any) => {
                handlers.reorder({ from: source.index, to: destination?.index || 0 })
                setCoursePhaseChecksReordered(true)
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
                    {coursePhaseChecks}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>
          ) : (
            <Text c='dimmed'>No course phase checks found.</Text>
          )}
          <Group position='left'>
            <Button
              variant='outline'
              leftIcon={<IconTrash />}
              onClick={() => {
                setCoursePhaseDeletionConfirmationModalOpened(true)
              }}
            >
              Delete Phase
            </Button>
            <Button
              disabled={!coursePhaseChecksReordered}
              leftIcon={<IconDeviceFloppy />}
              onClick={() => {
                void dispatch(
                  updateCoursePhaseCheckOrdering({
                    coursePhaseId: coursePhase.id,
                    coursePhaseChecks: state.map((coursePhaseCheck, idx) => {
                      return { ...coursePhaseCheck, sequentialOrder: idx }
                    }),
                  }),
                )
                setCoursePhaseChecksReordered(false)
              }}
            >
              Save
            </Button>
          </Group>
        </Stack>
      </Collapse>
    </div>
  )
}
