import axios, { type AxiosError } from 'axios'
import { serverBaseUrl } from './configService'
import { notifications } from '@mantine/notifications'
import { type ThesisApplication } from '../redux/thesisApplicationsSlice/thesisApplicationsSlice'

export const createThesisApplication = async ({
  application,
  examinationReport,
  cv,
  bachelorReport,
}: {
  application: ThesisApplication
  examinationReport: File
  cv: File
  bachelorReport?: File
}): Promise<ThesisApplication | undefined> => {
  try {
    const formData = new FormData()
    formData.append(
      'thesisApplication',
      new Blob([JSON.stringify(application)], { type: 'application/json' }),
    )
    formData.append('examinationReport', examinationReport)
    formData.append('cv', cv)
    if (bachelorReport) {
      formData.append('bachelorReport', bachelorReport)
    }
    const response = await axios.post(`${serverBaseUrl}/api/thesis-applications`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    if (response.status >= 200 && response.status < 300) {
      notifications.show({
        color: 'green',
        autoClose: 5000,
        title: 'Success',
        message: `Your application was successfully submitted!`,
      })
    }
    return response.data
  } catch (err) {
    if ((err as AxiosError)?.response?.status === 400) {
      notifications.show({
        color: 'red',
        autoClose: 10000,
        title: 'Error',
        message: `${((err as AxiosError)?.response?.data as string) ?? ''}`,
      })
    } else {
      notifications.show({
        color: 'red',
        autoClose: 10000,
        title: 'Error',
        message: `Failed to submit the application. Server responded with ${err as string}`,
      })
    }

    return undefined
  }
}

export const loadThesisApplicationExaminationFile = async (
  thesisApplicationId: string,
): Promise<Blob | undefined> => {
  try {
    const response = await axios.get(
      `${serverBaseUrl}/api/thesis-applications/${thesisApplicationId}/examination-report`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
        responseType: 'blob',
      },
    )
    if (response) {
      return new Blob([response.data], { type: 'application/pdf' })
    }
    return undefined
  } catch (err) {
    return undefined
  }
}

export const loadThesisApplicationCvFile = async (
  thesisApplicationId: string,
): Promise<Blob | undefined> => {
  try {
    const response = await axios.get(
      `${serverBaseUrl}/api/thesis-applications/${thesisApplicationId}/cv`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
        responseType: 'blob',
      },
    )
    if (response) {
      return new Blob([response.data], { type: 'application/pdf' })
    }
    return undefined
  } catch (err) {
    return undefined
  }
}

export const loadThesisApplicationBachelorReportFile = async (
  thesisApplicationId: string,
): Promise<Blob | undefined> => {
  try {
    const response = await axios.get(
      `${serverBaseUrl}/api/thesis-applications/${thesisApplicationId}/bachelor-report`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
        responseType: 'blob',
      },
    )
    if (response) {
      return new Blob([response.data], { type: 'application/pdf' })
    }
    return undefined
  } catch (err) {
    return undefined
  }
}
