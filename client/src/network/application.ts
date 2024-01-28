import { notifications } from '@mantine/notifications'
import {
  type Application,
  type ApplicationStatus,
} from '../redux/applicationsSlice/applicationsSlice'
import { type ApplicationType } from '../interface/application'
import { Patch, axiosInstance } from '../service/configService'

export const getApplications = async (
  applicationType: ApplicationType,
  courseIteration: string,
  status?: keyof typeof ApplicationStatus,
): Promise<Application[]> => {
  try {
    return (
      await axiosInstance.get(
        `/api/applications/${applicationType}?courseIteration=${courseIteration}${
          status ? `&applicationStatus=${status}` : ''
        }`,
      )
    ).data
  } catch (err) {
    notifications.show({
      color: 'red',
      autoClose: 10000,
      title: 'Error',
      message: `Could not fetch ${applicationType} applications.`,
    })
    return []
  }
}

export const patchApplicationAssessment = async (
  applicationType: ApplicationType,
  applicationId: string,
  assessmentPatch: Patch[],
): Promise<Application | undefined> => {
  try {
    return (
      await axiosInstance.patch(
        `/api/applications/${applicationType}/${applicationId}/assessment`,
        assessmentPatch,
        {
          headers: {
            'Content-Type': 'application/json-path+json',
          },
        },
      )
    ).data
  } catch (err) {
    return undefined
  }
}
