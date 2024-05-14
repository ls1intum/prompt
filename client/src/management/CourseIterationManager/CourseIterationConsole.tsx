import { Tabs } from '@mantine/core'
import { ActiveCourseIterationManager } from './components/ActiveCourseIterationManager.tsx/ActiveCourseIterationManager'
import { CourseIterationManager } from './components/CourseIterationManager/CourseIterationManager'
import { CoursePhasesManager } from './components/CoursePhasesManager/CoursePhasesManager'
import { IconListCheck, IconListDetails, IconTargetArrow } from '@tabler/icons-react'

export const CourseIterationConsole = (): JSX.Element => {
  return (
    <Tabs defaultValue='course-iterations-overview' variant='outline'>
      <Tabs.List>
        <Tabs.Tab value='course-iterations-overview' leftSection={<IconListDetails />}>
          Course Iterations Overview
        </Tabs.Tab>
        <Tabs.Tab value='active-course-iteration' leftSection={<IconTargetArrow />}>
          Active Course Iteration
        </Tabs.Tab>
        <Tabs.Tab value='course-phases-manager' leftSection={<IconListCheck />}>
          Course Phases Manager
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='course-iterations-overview'>
        <CourseIterationManager />
      </Tabs.Panel>
      <Tabs.Panel value='active-course-iteration'>
        <ActiveCourseIterationManager />
      </Tabs.Panel>
      <Tabs.Panel value='course-phases-manager'>
        <CoursePhasesManager />
      </Tabs.Panel>
    </Tabs>
  )
}
