import { Tabs } from '@mantine/core'
import { ActiveCourseIterationManager } from './components/ActiveCourseIterationManager.tsx/ActiveCourseIterationManager'
import { CourseIterationManager } from './components/CourseIterationManager'

export const CourseIterationConsole = (): JSX.Element => {
  return (
    <Tabs defaultValue='active-course-iteration' variant='outline'>
      <Tabs.List>
        <Tabs.Tab value='active-course-iteration'>Active Course Iteration</Tabs.Tab>
        <Tabs.Tab value='course-iterations-overview'>Course Iterations Overview</Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='active-course-iteration'>
        <ActiveCourseIterationManager />
      </Tabs.Panel>
      <Tabs.Panel value='course-iterations-overview'>
        <CourseIterationManager />
      </Tabs.Panel>
    </Tabs>
  )
}
