import { Box, Button, Center, Container, Group, Loader, Text } from '@mantine/core'
import { type ApplicationFormAccessMode, DefaultApplicationForm } from './DefaultApplicationForm'
import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../redux/store'
import { createDeveloperApplication } from '../redux/studentApplicationSlice/thunks/createDeveloperApplication'
import { updateDeveloperApplicationAssessment } from '../redux/studentApplicationSlice/thunks/updateDeveloperApplicationAssessment'
import {
  type DeveloperApplication,
  Gender,
  LanguageProficiency,
  StudyDegree,
  StudyProgram,
} from '../redux/studentApplicationSlice/studentApplicationSlice'
import { type Patch } from '../service/configService'
import { useEffect } from 'react'
import { fetchCourseIterationsWithOpenApplicationPeriod } from '../redux/courseIterationSlice/thunks/fetchAllCourseIterations'

export interface DeveloperApplicationFormProps {
  developerApplication?: DeveloperApplication
  accessMode: ApplicationFormAccessMode
  onSuccess: () => void
}

export const DeveloperApplicationForm = ({
  accessMode,
  developerApplication,
  onSuccess,
}: DeveloperApplicationFormProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const courseIterationWithOpenApplicationPeriod = useAppSelector(
    (state) => state.courseIterations.courseIterationWithOpenApplicationPeriod,
  )
  const loading = useAppSelector((state) => state.courseIterations.status)
  const form = useForm<DeveloperApplication>({
    initialValues: developerApplication
      ? {
          ...developerApplication,
          assessment: { ...developerApplication.assessment },
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
          projectTeam: undefined,
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
                form={form}
                title='Application for iPraktikum course as a Developer'
              />
              <Group position='right' mt='md'>
                <Button
                  type='submit'
                  disabled={!form.isValid()}
                  onClick={() => {
                    if (
                      form.isValid() &&
                      courseIterationWithOpenApplicationPeriod &&
                      !developerApplication
                    ) {
                      void dispatch(
                        createDeveloperApplication({
                          application: form.values,
                          courseIteration: courseIterationWithOpenApplicationPeriod.semesterName,
                        }),
                      )
                      onSuccess()
                    } else if (form.isValid() && developerApplication) {
                      // TODO: differentiate between assessment and student application changes
                      const studentApplicationAssessmentPatchObjectArray: Patch[] = []
                      Object.keys(form.values.assessment).forEach((key) => {
                        if (form.isTouched('assessment.' + key)) {
                          const studentApplicationPatchObject = new Map()
                          studentApplicationPatchObject.set('op', 'replace')
                          studentApplicationPatchObject.set('path', '/' + key)
                          studentApplicationPatchObject.set(
                            'value',
                            form.getInputProps('assessment.' + key).value,
                          )
                          const obj = Object.fromEntries(studentApplicationPatchObject)
                          studentApplicationAssessmentPatchObjectArray.push(obj)
                        }
                      })

                      void dispatch(
                        updateDeveloperApplicationAssessment({
                          applicationId: developerApplication.id,
                          applicationAssessmentPatch: studentApplicationAssessmentPatchObjectArray,
                        }),
                      )
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
