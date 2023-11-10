import { Alert, Progress, Stack } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../../redux/store'
import { useEffect, useMemo } from 'react'
import { fetchIntroCourseParticipations } from '../../redux/introCourseSlice/thunks/fetchIntroCourseParticipations'
import { SeatPlanManager } from './components/SeatPlanManager'
import moment from 'moment'
import { fetchAllIntroCourseTutors } from '../../redux/introCourseSlice/thunks/fetchAllIntroCourseTutors'
import { Link } from 'react-router-dom'
import type Keycloak from 'keycloak-js'

interface IntroCourseConsoleProps {
  keycloak: Keycloak
}

export const IntroCourseConsole = ({ keycloak }: IntroCourseConsoleProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)

  const introCourseProgress = useMemo(() => {
    if (selectedCourseIteration) {
      const currentDate = moment()

      const introCourseStart = moment(selectedCourseIteration.introCourseStart)
      const introCourseEnd = moment(selectedCourseIteration.introCourseEnd)

      const totalDuration = introCourseEnd.diff(introCourseStart)
      const elapsedDuration = currentDate.diff(introCourseStart)
      const progress = (elapsedDuration / totalDuration) * 100

      return Math.min(Math.max(progress, 0), 100)
    }
  }, [selectedCourseIteration])

  useEffect(() => {
    if (selectedCourseIteration) {
      void dispatch(fetchIntroCourseParticipations(selectedCourseIteration.semesterName))
      void dispatch(fetchAllIntroCourseTutors(selectedCourseIteration.semesterName))
    }
  }, [dispatch, selectedCourseIteration])

  return (
    <Stack>
      {(!selectedCourseIteration?.introCourseStart || !selectedCourseIteration?.introCourseEnd) && (
        <Alert icon={<IconAlertCircle size='1rem' />} title='Action required!' color='red'>
          You have not specified the intro course period for the current semester. Please visit the{' '}
          <Link to='/management/course-iterations'>Course Iteration Management</Link> console and
          specify the dates!
        </Alert>
      )}
      {selectedCourseIteration?.introCourseStart &&
        selectedCourseIteration?.introCourseEnd &&
        !!introCourseProgress && (
          <Progress.Root size='xl'>
            <Progress.Section value={introCourseProgress} color='blue'>
              <Progress.Label>Intro Course Progress</Progress.Label>
            </Progress.Section>
          </Progress.Root>
        )}
      <SeatPlanManager keycloak={keycloak} />
    </Stack>
  )
}