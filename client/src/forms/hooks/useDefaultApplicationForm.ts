import { useForm, isEmail, isNotEmpty } from '@mantine/form'
import { type Application } from '../../interface/application'
import { ApplicationFormAccessMode } from '../DefaultApplicationForm'

export const useDefaultApplicationForm = (
  initalValueApplication?: Application,
  accessMode?: ApplicationFormAccessMode,
) => {
  const manualMode = accessMode === ApplicationFormAccessMode.INSTRUCTOR_MANUAL_ADDING

  return useForm<Partial<Application>>({
    initialValues: initalValueApplication
      ? {
          ...initalValueApplication,
        }
      : {
          id: '',
          student: {
            id: '',
            tumId: '',
            matriculationNumber: '',
            isExchangeStudent: false,
            email: '',
            firstName: '',
            lastName: '',
            nationality: '',
            gender: undefined,
            suggestedAsCoach: false,
            suggestedAsTutor: false,
            blockedByPm: false,
            reasonForBlockedByPm: '',
          },
          studyDegree: undefined,
          studyProgram: undefined,
          currentSemester: '',
          englishLanguageProficiency: undefined,
          germanLanguageProficiency: undefined,
          motivation: '',
          experience: '',
          devices: [],
          coursesTaken: [],
        },
    validateInputOnBlur: true,
    validate: {
      student: {
        tumId: (value, values) =>
          /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{3}$/.test(value ?? '') || values.student?.isExchangeStudent
            ? null
            : 'This is not a valid TUM ID',
        matriculationNumber: (value, values) =>
          /^\d{8}$/.test(value ?? '') || values.student?.isExchangeStudent
            ? null
            : 'This is not a valid matriculation number.',
        firstName: isNotEmpty('Please state your first name.'),
        lastName: isNotEmpty('Please state your last name'),
        email: isEmail('Invalid email'),
        gender: isNotEmpty('Please state your gender.'),
        nationality: isNotEmpty('Please state your nationality.'),
      },
      studyDegree: manualMode ? undefined : isNotEmpty('Please state your study degree.'),
      studyProgram: manualMode ? undefined : isNotEmpty('Please state your study program.'),
      currentSemester: (value) => {
        if (manualMode) {
          return null
        }
        return !value || value.length === 0 || !/\b([1-9]|[1-9][0-9])\b/.test(value)
          ? 'Please state your current semester.'
          : null
      },
      motivation: (value) => {
        if (manualMode) {
          return null
        }
        if (!value || !isNotEmpty(value)) {
          return 'Please state your motivation for the course participation.'
        } else if (value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
      },
      experience: (value) => {
        if (manualMode) {
          return null
        }
        if (!value || !isNotEmpty(value)) {
          return 'Please state your experience prior to the course participation.'
        } else if (value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
      },
      englishLanguageProficiency: manualMode
        ? undefined
        : isNotEmpty('Please state your English language proficiency.'),
      germanLanguageProficiency: manualMode
        ? undefined
        : isNotEmpty('Please state your German language proficiency.'),
    },
  })
}
