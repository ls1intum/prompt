import { Tabs } from '@mantine/core'
import { IconChairDirector, IconUsers } from '@tabler/icons-react'
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
        <Tabs.Tab value='student-mgmt' icon={<IconUsers />}>
          Student Management
        </Tabs.Tab>
      </Tabs.List>
      <Tabs.Panel value='seat-plan-management'>
        <SeatPlanManager />
      </Tabs.Panel>
      <Tabs.Panel value='student-mgmt'>Student Management</Tabs.Panel>
    </Tabs>
  )
}
