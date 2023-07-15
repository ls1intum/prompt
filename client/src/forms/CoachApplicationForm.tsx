import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { ApplicationFormAccessMode, DefaultApplicationForm } from './DefaultApplicationForm'
import {
  Box,
  Button,
  Center,
  Checkbox,
  Group,
  Loader,
  Spoiler,
  Stack,
  Text,
  Textarea,
  Title,
} from '@mantine/core'
import {
  type CoachApplication,
  type Application,
} from '../redux/applicationsSlice/applicationsSlice'
import { useEffect, useState } from 'react'
import { fetchCourseIterationsWithOpenCoachApplicationPeriod } from '../redux/courseIterationSlice/thunks/fetchAllCourseIterations'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../redux/store'
import { createCoachApplication } from '../service/applicationsService'
import { ApplicationSuccessfulSubmission } from '../student/StudentApplicationSubmissionPage/ApplicationSuccessfulSubmission'
import { DeclarationOfDataConsent } from './DeclarationOfDataConsent'
import { ApplicationAssessmentForm } from './ApplicationAssessmentForm'

interface CoachApplicationFormProps {
  coachApplication?: CoachApplication
  accessMode: ApplicationFormAccessMode
  onSuccess: () => void
}

export const CoachApplicationForm = ({
  accessMode,
  coachApplication,
  onSuccess,
}: CoachApplicationFormProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [applicationSuccessfullySubmitted, setApplicationSuccessfullySubmitted] = useState(false)
  const courseIterationWithOpenCoachApplicationPeriod = useAppSelector(
    (state) => state.courseIterations.courseIterationWithOpenCoachApplicationPeriod,
  )
  const loading = useAppSelector((state) => state.courseIterations.status)
  const defaultForm = useForm<Application>({
    initialValues: coachApplication
      ? {
          ...coachApplication,
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
          /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{3}$/.test(value ?? '') || values.student.isExchangeStudent
            ? null
            : 'This is not a valid TUM ID',
        matriculationNumber: (value, values) =>
          /^[0-9]+$/.test(value ?? '') || values.student.isExchangeStudent
            ? null
            : 'This is not a valid matriculation number.',
        firstName: isNotEmpty('Please state your first name.'),
        lastName: isNotEmpty('Please state your last name'),
        email: isEmail('Invalid email'),
        gender: isNotEmpty('Please state your gender.'),
        nationality: isNotEmpty('Please state your nationality.'),
      },
      studyDegree: isNotEmpty('Please state your study degree.'),
      studyProgram: isNotEmpty('Please state your study program.'),
      currentSemester: (value) => {
        return !value || value.length === 0 || !/\b([1-9]|[1-9][0-9])\b/.test(value)
          ? 'Please state your current semester.'
          : null
      },
      motivation: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please state your motivation for the course participation.'
        } else if (value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
      },
      experience: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please state your experience prior to the course participation.'
        } else if (value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
      },
      englishLanguageProficiency: isNotEmpty('Please state your English language proficiency.'),
      germanLanguageProficiency: isNotEmpty('Please state your German language proficiency.'),
    },
  })
  const coachForm = useForm({
    initialValues: {
      solvedProblem: coachApplication?.solvedProblem ?? '',
    },
    validateInputOnBlur: true,
    validate: {
      solvedProblem: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please state the problem you solved during your participation in the iPraktikum course as a developer.'
        } else if (value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
      },
    },
  })
  const consentForm = useForm({
    initialValues: {
      dataConsent: false,
      workloadConsent: false,
    },
    validateInputOnChange: true,
    validate: {
      dataConsent: (value) => !value,
      workloadConsent: (value) => !value,
    },
  })

  useEffect(() => {
    if (accessMode === ApplicationFormAccessMode.STUDENT) {
      void dispatch(fetchCourseIterationsWithOpenCoachApplicationPeriod())
    }
  }, [accessMode])

  return (
    <>
      {loading === 'loading' ? (
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
          }}
        >
          <Center>
            <Loader />
          </Center>
        </div>
      ) : (
        <>
          {courseIterationWithOpenCoachApplicationPeriod ??
          accessMode === ApplicationFormAccessMode.INSTRUCTOR ? (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', maxWidth: '60vw', gap: '2vh' }}
              mx='auto'
            >
              {applicationSuccessfullySubmitted ? (
                <ApplicationSuccessfulSubmission />
              ) : (
                <>
                  <DefaultApplicationForm
                    accessMode={accessMode}
                    form={defaultForm}
                    title='Application for Agile Project Management Practical Course'
                  />
                  <div>
                    <Textarea
                      label='Challenge'
                      disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                      autosize
                      minRows={5}
                      placeholder='Describe a problem that occurred in a team and how you solved it'
                      withAsterisk
                      required
                      {...coachForm.getInputProps('solvedProblem')}
                    />
                    {!coachForm.errors.solvedProblem && (
                      <Text fz='xs' ta='right'>{`${
                        coachForm.values.solvedProblem?.length ?? 0
                      } / 500`}</Text>
                    )}
                  </div>
                  {accessMode === ApplicationFormAccessMode.STUDENT && (
                    <Stack>
                      <Checkbox
                        mt='md'
                        label='I have read the declaration of consent below and agree to the processing of my data.'
                        {...consentForm.getInputProps('dataConsent', { type: 'checkbox' })}
                      />
                      <Spoiler
                        maxHeight={0}
                        showLabel={<Text fz='sm'>Show Data Consent Agreement</Text>}
                        hideLabel={<Text fz='sm'>Hide</Text>}
                      >
                        <DeclarationOfDataConsent />
                      </Spoiler>
                      <Checkbox
                        mt='md'
                        label={`I am aware that the Agile Project Mamagement is a very demanding 10 ECTS practical course and I agree to put in the required amount of work, time and effort.`}
                        {...consentForm.getInputProps('workloadConsent', { type: 'checkbox' })}
                      />
                    </Stack>
                  )}
                  <Group position='right' mt='md'>
                    <Button
                      disabled={
                        !defaultForm.isValid() ||
                        !coachForm.isValid() ||
                        (!consentForm.isValid() && accessMode === ApplicationFormAccessMode.STUDENT)
                      }
                      type='submit'
                      onClick={() => {
                        if (
                          defaultForm.isValid() &&
                          coachForm.isValid() &&
                          courseIterationWithOpenCoachApplicationPeriod &&
                          !coachApplication
                        ) {
                          createCoachApplication({
                            application: {
                              ...defaultForm.values,
                              ...coachForm.values,
                            },
                            courseIteration:
                              courseIterationWithOpenCoachApplicationPeriod.semesterName,
                          })
                            .then((response) => {
                              if (response) {
                                setApplicationSuccessfullySubmitted(true)
                              }
                            })
                            .catch(() => {})
                          onSuccess()
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </Group>
                  {accessMode === ApplicationFormAccessMode.INSTRUCTOR && coachApplication && (
                    <ApplicationAssessmentForm
                      applicationId={coachApplication.id}
                      assessment={coachApplication.assessment}
                      applicationType='coach'
                    />
                  )}
                </>
              )}
            </Box>
          ) : (
            <div
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                height: '100vh',
              }}
            >
              <Title order={5}>Application period is closed.</Title>
            </div>
          )}
        </>
      )}
    </>
  )
}
