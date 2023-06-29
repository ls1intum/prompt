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
  Textarea,
  Title,
} from '@mantine/core'
import {
  type CoachApplication,
  type Application,
} from '../redux/applicationsSlice/applicationsSlice'
import { useEffect, useState } from 'react'
import { fetchCourseIterationsWithOpenApplicationPeriod } from '../redux/courseIterationSlice/thunks/fetchAllCourseIterations'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../redux/store'
import { type Patch } from '../service/configService'
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
  const courseIterationWithOpenApplicationPeriod = useAppSelector(
    (state) => state.courseIterations.courseIterationWithOpenApplicationPeriod,
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
  const coachForm = useForm({
    initialValues: {
      solvedProblem: '',
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
                    title='Application for Agile Project Management Practical Course'
                  />
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
                          courseIterationWithOpenApplicationPeriod &&
                          !coachApplication
                        ) {
                          createCoachApplication({
                            application: {
                              ...defaultForm.values,
                              ...coachForm.values,
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
                        } else if (
                          defaultForm.isValid() &&
                          coachForm.isValid() &&
                          coachApplication
                        ) {
                          // TODO: differentiate between assessment and student application changes
                          if (defaultForm.values.assessment) {
                            const studentApplicationAssessmentPatchObjectArray: Patch[] = []
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
