import { Alert, Progress, Stack } from '@mantine/core'
import { IconAlertCircle } from '@tabler/icons-react'
import { useEffect, useMemo } from 'react'
import { SeatPlanManager } from './components/SeatPlanManager'
import moment from 'moment'
import { Link } from 'react-router-dom'
import type Keycloak from 'keycloak-js'
import { useCourseIterationStore } from '../../state/zustand/useCourseIterationStore'
import { useIntroCourseStore } from '../../state/zustand/useIntroCourseStore'
import { useQuery } from '@tanstack/react-query'
import { IntroCourseParticipation } from '../../interface/introCourse'
import { Query } from '../../state/query'
import { getIntroCourseParticipations, getIntroCourseTutors } from '../../network/introCourse'
import { Student } from '../../interface/application'

interface IntroCourseConsoleProps {
  keycloak: Keycloak
}

export const IntroCourseConsole = ({ keycloak }: IntroCourseConsoleProps): JSX.Element => {
  const { selectedCourseIteration } = useCourseIterationStore()
  const { setParticipations, setTutors } = useIntroCourseStore()

  const { data: participations } = useQuery<IntroCourseParticipation[]>({
    queryKey: [Query.INTRO_COURSE, selectedCourseIteration?.semesterName],
    queryFn: () => getIntroCourseParticipations(selectedCourseIteration?.semesterName ?? ''),
  })

  const { data: tutors } = useQuery<Student[]>({
    queryKey: [Query.INTRO_COURSE, selectedCourseIteration?.semesterName],
    enabled: !!selectedCourseIteration,
    queryFn: () => getIntroCourseTutors(selectedCourseIteration?.semesterName ?? ''),
  })

  useEffect(() => {
    if (participations) {
      setParticipations(participations)
    }
  }, [participations, setParticipations])

  useEffect(() => {
    if (tutors) {
      setTutors(tutors)
    }
  }, [tutors, setTutors])

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
