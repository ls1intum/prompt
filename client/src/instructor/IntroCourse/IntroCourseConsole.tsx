import { Tabs } from '@mantine/core'
import { IconChairDirector, IconDeviceLaptop, IconUsers } from '@tabler/icons-react'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../../redux/store'
import { useEffect } from 'react'
import { fetchIntroCourseParticipations } from '../../redux/introCourseSlice/thunks/fetchIntroCourseParticipations'
import { SeatPlanManager } from './components/SeatPlanManager'
import { fetchTutorApplications } from '../../redux/applicationsSlice/thunks/fetchApplications'

export const IntroCourseConsole = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)

  useEffect(() => {
    if (selectedCourseIteration) {
      void dispatch(fetchIntroCourseParticipations(selectedCourseIteration.semesterName))
      void dispatch(
        fetchTutorApplications({
          courseIteration: selectedCourseIteration.semesterName,
          status: 'ENROLLED',
        }),
      )
    }
  }, [selectedCourseIteration])

  return (
    <Tabs defaultValue='seat-plan-management'>
      <Tabs.List>
        <Tabs.Tab value='seat-plan-management' icon={<IconChairDirector />}>
          Seat Plan Management
        </Tabs.Tab>
        <Tabs.Tab value='device-management' icon={<IconDeviceLaptop />}>
          Device Management
        </Tabs.Tab>
        <Tabs.Tab value='student-assessments' icon={<IconUsers />}>
          Student Assessments
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='seat-plan-management'>
        <SeatPlanManager />
      </Tabs.Panel>
      <Tabs.Panel value='device-management'>Device Management</Tabs.Panel>
      <Tabs.Panel value='student-assessments'>Student Assessments</Tabs.Panel>
    </Tabs>
  )
}
