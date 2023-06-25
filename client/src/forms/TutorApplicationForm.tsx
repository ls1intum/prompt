import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { type ApplicationFormAccessMode, DefaultApplicationForm } from './DefaultApplicationForm'
import { Box, Button, Center, Container, Group, Loader, Text } from '@mantine/core'
import {
  Gender,
  StudyDegree,
  StudyProgram,
  LanguageProficiency,
  type Application,
  type TutorApplication,
} from '../redux/studentApplicationSlice/studentApplicationSlice'
import { useEffect } from 'react'
import { fetchCourseIterationsWithOpenApplicationPeriod } from '../redux/courseIterationSlice/thunks/fetchAllCourseIterations'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../redux/store'
import { type Patch } from '../service/configService'
import { createTutorApplication } from '../redux/studentApplicationSlice/thunks/createTutorApplication'

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
  const loading = useAppSelector((state) => state.courseIterations.status)
  const defaultForm = useForm<Application>({
    initialValues: tutorApplication
      ? {
          ...tutorApplication,
          assessment: { ...tutorApplication.assessment },
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
            gender: Gender.PREFER_NOT_TO_SAY,
          },
          studyDegree: StudyDegree.BACHELOR,
          studyProgram: StudyProgram.COMPUTER_SCIENCE,
          currentSemester: '',
          englishLanguageProficiency: LanguageProficiency.A1A2,
          germanLanguageProficiency: LanguageProficiency.A1A2,
          motivation: '',
          experience: '',
          devices: [],
          coursesTaken: [],
          assessment: {
            instructorComments: [],
            suggestedAsCoach: false,
            suggestedAsTutor: false,
            blockedByPM: false,
            reasonForBlockedByPM: '',
            assessmentScore: 0,
            assessed: false,
            accepted: false,
          },
        },
    validateInputOnBlur: true,
    validate: {
      student: {
        tumId: (value) =>
          /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{3}$/.test(value) ? null : 'This is not a valid TUM ID',
        matriculationNumber: (value) =>
          /^[0-9]+$/.test(value) ? null : 'This is not a valid matriculation number.',
        firstName: isNotEmpty('Please state your first name.'),
        lastName: isNotEmpty('Please state your last name'),
        email: isEmail('Invalid email'),
        gender: isNotEmpty('Please state your gender.'),
        nationality: isNotEmpty('Please state your nationality.'),
      },
      studyDegree: isNotEmpty('Please state your study degree.'),
      studyProgram: isNotEmpty('Please state your study program.'),
      currentSemester: isNotEmpty('Please state your current semester.'),
      motivation: (value) =>
        value.length <= 500 ? null : 'The maximum allowed number of characters is 500.',
      experience: (value) =>
        value.length <= 500 ? null : 'The maximum allowed number of characters is 500.',
      englishLanguageProficiency: isNotEmpty('Please state your English language proficiency.'),
      germanLanguageProficiency: isNotEmpty('Please state your German language proficiency.'),
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
              <DefaultApplicationForm
                accessMode={accessMode}
                form={defaultForm}
                title='Application for iPraktikum course as a Tutor'
              />
              <Group position='right' mt='md'>
                <Button
                  type='submit'
                  onClick={() => {
                    if (
                      defaultForm.isValid() &&
                      courseIterationWithOpenApplicationPeriod &&
                      !tutorApplication
                    ) {
                      void dispatch(
                        createTutorApplication({
                          application: {
                            ...defaultForm.values,
                          },
                          courseIteration: courseIterationWithOpenApplicationPeriod.semesterName,
                        }),
                      )
                      onSuccess()
                    } else if (defaultForm.isValid() && tutorApplication) {
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
                  }}
                >
                  Submit
                </Button>
              </Group>
            </Box>
          ) : (
            <Container>
              <Text>Application period is closed.</Text>
            </Container>
          )}
        </>
      )}
    </>
  )
}
