import { notifications } from '@mantine/notifications'
import { type CourseIteration } from '../redux/courseIterationSlice/courseIterationSlice'
import { axiosInstance } from '../service/configService'

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
