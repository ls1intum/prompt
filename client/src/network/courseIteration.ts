import { notifications } from '@mantine/notifications'
import { Patch, axiosInstance } from './configService'
import { CourseIteration, CourseIterationRequest } from '../interface/courseIteration'
import { ApplicationType } from '../interface/application'

export const getCourseIterations = async (): Promise<CourseIteration[]> => {
  try {
    return (await axiosInstance.get(`/api/course-iterations`)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch course iterations.`,
    })
    return []
  }
}

export const getCourseIterationsWithOpenKickOffPeriod = async (): Promise<
  CourseIteration | undefined
> => {
  try {
    return (await axiosInstance.get(`/api/course-iterations/open/kick-off`)).data
  } catch (err) {
    return undefined
  }
}

export const getCourseIterationsWithOpenApplicationPeriod = async (
  applicationType: ApplicationType,
): Promise<CourseIteration | undefined> => {
  try {
    return (await axiosInstance.get(`/api/course-iterations/open/${applicationType}`)).data
  } catch (err) {
    return undefined
  }
}

export const postCourseIteration = async (
  courseIteration: CourseIterationRequest,
): Promise<CourseIteration | undefined> => {
  try {
    return (await axiosInstance.post(`/api/course-iterations`, courseIteration)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not create course iteration.`,
    })
    return undefined
  }
}

export const patchCourseIteration = async (
  courseIterationId: string,
  courseIterationPatch: Patch[],
): Promise<CourseIteration | undefined> => {
  try {
    return (
      await axiosInstance.patch(
        `/api/course-iterations/${courseIterationId}`,
        courseIterationPatch,
        {
          headers: {
            'Content-Type': 'application/json-path+json',
          },
        },
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not update course iteration.`,
    })
    return undefined
  }
}

export const deleteCourseIteration = async (
  courseIterationId: string,
): Promise<string | undefined> => {
  try {
    return (await axiosInstance.delete(`/api/course-iterations/${courseIterationId}`)).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not delete course iteration.`,
    })
    return undefined
  }
}

export const toggleCourseIterationPhaseCheckEntry = async (
  courseIterationId: string,
  courseIterationPhaseCheckEntryId: string,
): Promise<CourseIteration | undefined> => {
  try {
    return (
      await axiosInstance.post(
        `/api/course-iterations/${courseIterationId}/course-iteration-phase-check-entries/${courseIterationPhaseCheckEntryId}`,
        {},
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not toggle phase check entry for course iteration.`,
    })
    return undefined
  }
}
