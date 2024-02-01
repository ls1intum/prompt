import { notifications } from '@mantine/notifications'
import { CoursePhase, CoursePhaseCheck } from '../interface/coursePhase'
import { axiosInstance } from '../service/configService'

export const getCoursePhases = async (): Promise<CoursePhase[]> => {
  try {
    return (await axiosInstance.get(`/api/course-phases`)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch course phases.`,
    })
    return []
  }
}

export const postCoursePhase = async (
  coursePhase: CoursePhase,
): Promise<CoursePhase | undefined> => {
  try {
    return (await axiosInstance.post(`/api/course-phases`, coursePhase)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not create course phase.`,
    })
    return undefined
  }
}

export const deleteCoursePhase = async (coursePhaseId: string): Promise<string | undefined> => {
  try {
    return (await axiosInstance.delete(`/api/course-phases/${coursePhaseId}`)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not delete course phase.`,
    })
    return undefined
  }
}

export const postCoursePhaseCheck = async (
  coursePhaseId: string,
  coursePhaseCheck: CoursePhaseCheck,
): Promise<CoursePhaseCheck | undefined> => {
  try {
    return (
      await axiosInstance.post(
        `/api/course-phases/${coursePhaseId}/course-phase-checks`,
        coursePhaseCheck,
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not create course phase check.`,
    })
    return undefined
  }
}

export const deleteCoursePhaseCheck = async (
  coursePhaseId: string,
  coursePhaseCheckId: string,
): Promise<string | undefined> => {
  try {
    return (
      await axiosInstance.delete(
        `/api/course-phases/${coursePhaseId}/course-phase-checks/${coursePhaseCheckId}`,
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not delete course phase check.`,
    })
    return undefined
  }
}

export const patchCoursePhaseCheckOrder = async (
  coursePhaseId: string,
  coursePhaseChecks: CoursePhaseCheck[],
): Promise<CoursePhase | undefined> => {
  try {
    return (
      await axiosInstance.patch(
        `/api/course-phases/${coursePhaseId}/course-phase-checks`,
        coursePhaseChecks,
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not change order of course phase checks.`,
    })
    return undefined
  }
}
