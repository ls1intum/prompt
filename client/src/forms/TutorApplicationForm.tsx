import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { ApplicationFormAccessMode, DefaultApplicationForm } from './DefaultApplicationForm'
import {
  Anchor,
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
  type Application,
  type TutorApplication,
} from '../redux/applicationsSlice/applicationsSlice'
import { useEffect, useState } from 'react'
import { fetchCourseIterationsWithOpenApplicationPeriod } from '../redux/courseIterationSlice/thunks/fetchAllCourseIterations'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../redux/store'
import { type Patch } from '../service/configService'
import { createTutorApplication } from '../service/applicationsService'
import { ApplicationSuccessfulSubmission } from '../student/StudentApplicationSubmissionPage/ApplicationSuccessfulSubmission'
import { DeclarationOfDataConsent } from './DeclarationOfDataConsent'
import { ApplicationAssessmentForm } from './ApplicationAssessmentForm'

interface TutorApplicationFormProps {
  tutorApplication?: TutorApplication
  accessMode: ApplicationFormAccessMode
  onSuccess: () => void
}

export const TutorApplicationForm = ({
  accessMode,
  tutorApplication,
  onSuccess,
}: TutorApplicationFormProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const courseIterationWithOpenApplicationPeriod = useAppSelector(
    (state) => state.courseIterations.courseIterationWithOpenApplicationPeriod,
  )
  const [applicationSuccessfullySubmitted, setApplicationSuccessfullySubmitted] = useState(false)
  const loading = useAppSelector((state) => state.courseIterations.status)
  const defaultForm = useForm<Application>({
    initialValues: tutorApplication
      ? {
          ...tutorApplication,
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
        if (!value || value.length === 0) {
          return null
        }
        return /\b([1-9]|[1-9][0-9])\b/.test(value) ? null : 'Please state your current semester.'
      },
      motivation: (value) => {
        if (isNotEmpty(value) && value && value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        } else if (!isNotEmpty(value)) {
          return 'Please state your motivation for the course participation.'
        }
      },
      experience: (value) => {
        if (isNotEmpty(value) && value && value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        } else if (!isNotEmpty(value)) {
          return 'Please state your experience prior to the course participation.'
        }
      },
      englishLanguageProficiency: isNotEmpty('Please state your English language proficiency.'),
      germanLanguageProficiency: isNotEmpty('Please state your German language proficiency.'),
    },
  })
  const tutorForm = useForm({
    initialValues: {
      reasonGoodTutor: '',
    },
  })
  const consentForm = useForm({
    initialValues: {
      dataConsent: false,
      introCourseConsent: false,
    },
    validateInputOnChange: true,
    validate: {
      dataConsent: (value) => !value,
      introCourseConsent: (value) => !value,
    },
  })

  useEffect(() => {
    void dispatch(fetchCourseIterationsWithOpenApplicationPeriod())
  }, [])

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
          {courseIterationWithOpenApplicationPeriod ? (
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
                    title='Application for Teaching iOS Practical Course'
                  />
                  <Textarea
                    label='Why do You consider yourself a good tutor?'
                    disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                    autosize
                    minRows={5}
                    placeholder='Why do You consider yourself a good tutor?'
                    withAsterisk
                    required
                    {...tutorForm.getInputProps('reasonGoodTutor')}
                  />
                  {accessMode === ApplicationFormAccessMode.STUDENT && (
                    <Stack>
                      <Checkbox
                        mt='md'
                        label='I have read the declaration of consent below and agree to the processing of my data.'
                        {...consentForm.getInputProps('dataConsent', { type: 'checkbox' })}
                      />
                      <Spoiler
                        maxHeight={0}
                        showLabel='View Data Consent Agreement'
                        hideLabel='Hide'
                      >
                        <DeclarationOfDataConsent />
                      </Spoiler>
                      <Checkbox
                        mt='md'
                        label={
                          <Text>
                            I am aware that the course will take place before the semester starts.
                            The exact dates are listed on our{' '}
                            <Anchor
                              href='https://ase.cit.tum.de/ios'
                              target='_blank'
                              variant='blue'
                            >
                              website
                            </Anchor>
                            .
                          </Text>
                        }
                        {...consentForm.getInputProps('introCourseConsent', { type: 'checkbox' })}
                      />
                    </Stack>
                  )}
                  <Group position='right' mt='md'>
                    <Button
                      disabled={
                        !defaultForm.isValid() ||
                        !tutorForm.isValid() ||
                        (!consentForm.isValid() && accessMode === ApplicationFormAccessMode.STUDENT)
                      }
                      type='submit'
                      onClick={() => {
                        if (
                          defaultForm.isValid() &&
                          courseIterationWithOpenApplicationPeriod &&
                          !tutorApplication
                        ) {
                          createTutorApplication({
                            application: {
                              ...defaultForm.values,
                              ...tutorForm.values,
                            },
                            courseIteration: courseIterationWithOpenApplicationPeriod.semesterName,
                          })
                            .then((response) => {
                              if (response) {
                                setApplicationSuccessfullySubmitted(true)
                              }
                            })
                            .catch(() => {})
                          onSuccess()
                        } else if (defaultForm.isValid() && tutorApplication) {
                          const studentApplicationAssessmentPatchObjectArray: Patch[] = []
                          if (defaultForm.values.assessment) {
                            Object.keys(defaultForm.values.assessment).forEach((key) => {
                              if (defaultForm.isTouched('assessment.' + key)) {
                                const studentApplicationPatchObject = new Map()
                                studentApplicationPatchObject.set('op', 'replace')
                                studentApplicationPatchObject.set('path', '/' + key)
                                studentApplicationPatchObject.set(
                                  'value',
                                  defaultForm.getInputProps('assessment.' + key).value,
                                )
                                const obj = Object.fromEntries(studentApplicationPatchObject)
                                studentApplicationAssessmentPatchObjectArray.push(obj)
                              }
                            })

                            /* void dispatch(
                updateDeveloperApplicationAssessment({
                  applicationId: developerApplication.id,
                  applicationAssessmentPatch: studentApplicationAssessmentPatchObjectArray,
                }),
              ) */
                            onSuccess()
                          }
                        }
                      }}
                    >
                      Submit
                    </Button>
                  </Group>
                  {accessMode === ApplicationFormAccessMode.INSTRUCTOR && tutorApplication && (
                    <ApplicationAssessmentForm
                      applicationId={tutorApplication.id}
                      assessment={tutorApplication.assessment}
                      applicationType='tutor'
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
