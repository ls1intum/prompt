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
import { Button, Group, Stack, Text } from '@mantine/core'
import { CoursePhaseCheckCreationModal } from './CoursePhaseCheckCreationModal'
import { CoursePhaseAccordionItem } from './CoursePhaseAccordionItem'
import { IconChecks, IconGripVertical, IconPlus } from '@tabler/icons-react'
import { CoursePhaseCreationModal } from './CoursePhaseCreationModal'
import { useListState } from '@mantine/hooks'
import { useCoursePhaseStore } from '../../../../state/zustand/useCoursePhaseStore'
import { useQuery } from '@tanstack/react-query'
import { Query } from '../../../../state/query'
import { CoursePhase } from '../../../../interface/coursePhase'
import { getCoursePhases } from '../../../../network/coursePhase'

export const CoursePhasesManager = (): JSX.Element => {
  const [state, handlers] = useListState<CoursePhase>([])
  const { coursePhases, setCoursePhases } = useCoursePhaseStore()
  const [coursePhaseCreationModalOpened, setCoursePhaseCreationModalOpened] = useState(false)
  const [coursePhaseCheckCreationModalOpened, setCoursePhaseCheckCreationModalOpened] =
    useState(false)

  useEffect(() => {
    handlers.setState([...coursePhases].sort((a, b) => a.sequentialOrder - b.sequentialOrder))
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [coursePhases])

  const { data: fetchedCoursePhases } = useQuery<CoursePhase[]>({
    queryKey: [Query.COURSE_PHASE],
    queryFn: getCoursePhases,
  })

  useEffect(() => {
    if (fetchedCoursePhases) {
      setCoursePhases(fetchedCoursePhases)
    }
  }, [fetchedCoursePhases, setCoursePhases])

  const coursePhaseDndItems = state.map((coursePhase, index) => (
    <Draggable
      key={coursePhase.id.toString()}
      index={index}
      draggableId={coursePhase.id.toString()}
    >
      {(provided: {
        draggableProps: JSX.IntrinsicAttributes &
          ClassAttributes<HTMLDivElement> &
          HTMLAttributes<HTMLDivElement>
        dragHandleProps: JSX.IntrinsicAttributes &
          ClassAttributes<HTMLDivElement> &
          HTMLAttributes<HTMLDivElement>
        innerRef: LegacyRef<HTMLDivElement> | undefined
      }) => (
        <div {...provided.draggableProps} ref={provided.innerRef}>
          <Group style={{ display: 'flex' }}>
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
    <div
      style={{
        padding: '5vh 0',
        gap: '3vh',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
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
      <Group align='right'>
        <Button
          leftSection={<IconPlus />}
          onClick={() => {
            setCoursePhaseCreationModalOpened(true)
          }}
        >
          Add Phase
        </Button>
        <Button
          leftSection={<IconChecks />}
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
            handlers.reorder({
              from: source.index,
              to: destination?.index || 0,
            })
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
