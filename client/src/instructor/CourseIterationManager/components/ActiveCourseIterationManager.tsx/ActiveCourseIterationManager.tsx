import { Tabs, Text } from '@mantine/core'
import { useAppSelector } from '../../../../redux/store'
import { CoursePhaseTab } from './CoursePhaseTab'

export const ActiveCourseIterationManager = (): JSX.Element => {
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  return (
    <Tabs orientation='vertical' style={{ padding: '5vh 0', height: '80vh' }}>
      <Tabs.List grow>
        {selectedCourseIteration &&
          [...selectedCourseIteration?.phases]
            .sort((a, b) => a.coursePhase.sequentialOrder - b.coursePhase.sequentialOrder)
            .map((phase) => (
              <Tabs.Tab value={phase.coursePhase.name} key={phase.id}>
                <Text fw={500}>{phase.coursePhase.name}</Text>
              </Tabs.Tab>
            ))}
      </Tabs.List>
      {selectedCourseIteration?.phases.map((phase) => (
        <Tabs.Panel value={phase.coursePhase.name} key={phase.id}>
          <CoursePhaseTab
            courseIterationId={selectedCourseIteration.id}
            courseIterationPhase={phase}
          />
        </Tabs.Panel>
      ))}
    </Tabs>
  )
}
