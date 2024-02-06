import axios, { type AxiosError } from 'axios'
import { serverBaseUrl } from './configService'
import { notifications } from '@mantine/notifications'

export enum MailTemplate {
  DEVELOPER_APPLICATION_CONFIRMATION = 'developer-application-confirmation',
  COACH_APPLICATION_CONFIRMATION = 'coach-application-confirmation',
  COACH_APPLICATION_ACCEPTANCE = 'coach-application-acceptance',
  COACH_APPLICATION_REJECTION = 'coach-application-rejection',
  COACH_INTERVIEW_INVITATION = 'coach-interview-invitation',
  TUTOR_APPLICATION_CONFIRMATION = 'tutor-application-confirmation',
  TUTOR_APPLICATION_ACCEPTANCE = 'tutor-application-acceptance',
  TUTOR_APPLICATION_REJECTION = 'tutor-application-rejection',
  TUTOR_INTERVIEW_INVITATION = 'tutor-interview-invitation',
  TECHNICAL_DETAILS_SUBMISSION_INVIATION = 'technical-details-submission-invitation',
  KICK_OFF_SUBMISSION_INVITATION = 'kick-off-submission-invitation',
  THESIS_APPLICATION_CONFIRMATION = 'thesis-application-confirmation',
  THESIS_APPLICATION_CREATED = 'thesis-application-created',
  THESIS_APPLICATION_ACCEPTANCE = 'thesis-application-acceptance',
  THESIS_APPLICATION_ACCEPTANCE_NO_ADVISOR = 'thesis-application-acceptance-no-advisor',
  THESIS_APPLICATION_REJECTION = 'thesis-application-rejection',
}

export const fetchMailTemplate = async (template: any): Promise<string | undefined> => {
  try {
    const response = await axios.get(
      `${serverBaseUrl}/api/mailing/templates/${
        MailTemplate[template as keyof typeof MailTemplate]
      }`,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
      },
    )

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
        message: `Failed to fetch the template. Server responded with ${err as string}`,
      })
    }

    return undefined
  }
}

export const updateMailTemplate = async (
  template: any,
  htmlContents: string,
): Promise<string | undefined> => {
  try {
    const response = await axios.post(
      `${serverBaseUrl}/api/mailing/templates/${
        MailTemplate[template as keyof typeof MailTemplate]
      }`,
      htmlContents,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          'Content-Type': 'text/html',
        },
      },
    )
    if (response.status >= 200 && response.status < 300) {
      notifications.show({
        color: 'green',
        autoClose: 5000,
        title: 'Success',
        message: `Template has been updated successfully!`,
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
        message: `Failed to update the template. Server responded with ${err as string}`,
      })
    }

    return undefined
  }
}
