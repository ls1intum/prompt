import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd'
import {
  useEffect,
  useState,
  type ClassAttributes,
  type HTMLAttributes,
  type LegacyRef,
  type ReactElement,
  type JSXElementConstructor,
  type ReactFragment,
  type ReactPortal,
} from 'react'
import { fetchAllCoursePhases } from '../../../../redux/coursePhasesSlice/thunks/fetchAllCoursePhases'
import { Button, Group, Stack, Text, createStyles } from '@mantine/core'
import { CoursePhaseCheckCreationModal } from './CoursePhaseCheckCreationModal'
import { CoursePhaseAccordionItem } from './CoursePhaseAccordionItem'
import { IconChecks, IconGripVertical, IconPlus } from '@tabler/icons-react'
import { CoursePhaseCreationModal } from './CoursePhaseCreationModal'
import { useListState } from '@mantine/hooks'
import { type CoursePhase } from '../../../../redux/coursePhasesSlice/coursePhasesSlice'

const useStyles = createStyles((theme) => ({
  itemDragging: {
    boxShadow: theme.shadows.sm,
  },
}))

export const CoursePhasesManager = (): JSX.Element => {
  const { classes, cx } = useStyles()
  const dispatch = useDispatch<AppDispatch>()
  const [state, handlers] = useListState<CoursePhase>([])
  const coursePhases = useAppSelector((state) => state.coursePhases.coursePhases)
  const [coursePhaseCreationModalOpened, setCoursePhaseCreationModalOpened] = useState(false)
  const [coursePhaseCheckCreationModalOpened, setCoursePhaseCheckCreationModalOpened] =
    useState(false)

  useEffect(() => {
    handlers.setState([...coursePhases].sort((a, b) => a.sequentialOrder - b.sequentialOrder))
  }, [coursePhases])

  useEffect(() => {
    void dispatch(fetchAllCoursePhases())
  }, [])

  const coursePhaseDndItems = state.map((coursePhase, index) => (
    <Draggable
      key={coursePhase.id.toString()}
      index={index}
      draggableId={coursePhase.id.toString()}
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
        <div {...provided.draggableProps} ref={provided.innerRef}>
          <Group className={cx({ [classes.itemDragging]: snapshot.isDragging })}>
            <div {...provided.dragHandleProps}>
              <IconGripVertical />
            </div>
            <CoursePhaseAccordionItem coursePhase={coursePhase} />
          </Group>
        </div>
      )}
    </Draggable>
  ))

  return (
    <div style={{ padding: '5vh 0', gap: '3vh', display: 'flex', flexDirection: 'column' }}>
      <CoursePhaseCheckCreationModal
        coursePhases={coursePhases}
        opened={coursePhaseCheckCreationModalOpened}
        onClose={() => {
          setCoursePhaseCheckCreationModalOpened(false)
        }}
      />
      <CoursePhaseCreationModal
        opened={coursePhaseCreationModalOpened}
        onClose={() => {
          setCoursePhaseCreationModalOpened(false)
        }}
        nextSeqOrderNumber={coursePhases.length}
      />
      <Group position='right'>
        <Button
          leftIcon={<IconPlus />}
          onClick={() => {
            setCoursePhaseCreationModalOpened(true)
          }}
        >
          Add Phase
        </Button>
        <Button
          leftIcon={<IconChecks />}
          onClick={() => {
            setCoursePhaseCheckCreationModalOpened(true)
          }}
        >
          Add Phase Check
        </Button>
      </Group>
      {coursePhases.length > 0 ? (
        <DragDropContext
          onDragEnd={({ destination, source }: any) => {
            handlers.reorder({ from: source.index, to: destination?.index || 0 })
            // setCoursePhaseChecksReordered(true)
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
                <Stack>{coursePhaseDndItems}</Stack>
                {provided.placeholder}
              </div>
            )}
          </Droppable>
        </DragDropContext>
      ) : (
        <Text c='dimmed'>No course phases found.</Text>
      )}
    </div>
  )
}
