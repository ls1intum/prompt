import { Tabs } from '@mantine/core'
import { useAppSelector } from '../../../../redux/store'

export const ActiveCourseIterationManager = (): JSX.Element => {
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  return (
    <Tabs orientation='vertical' style={{ padding: '10vh 0' }}>
      <Tabs.List>
        {selectedCourseIteration?.phases.map((phase) => (
          <Tabs.Tab value={phase.coursePhase.name} key={phase.id}>
            {phase.coursePhase.name}
          </Tabs.Tab>
        ))}
      </Tabs.List>
      {selectedCourseIteration?.phases.map((phase) => (
        <Tabs.Panel value={phase.coursePhase.name} key={phase.id}>
          {phase.coursePhase.name}
        </Tabs.Panel>
      ))}
    </Tabs>
  )
}
