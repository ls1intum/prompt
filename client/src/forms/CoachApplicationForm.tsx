import { isNotEmpty, useForm } from '@mantine/form'
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
import { useState } from 'react'
import { Application, ApplicationType } from '../interface/application'
import { ApplicationSuccessfulSubmission } from '../student/StudentApplicationSubmissionPage/ApplicationSuccessfulSubmission'
import { DeclarationOfDataConsent } from './DeclarationOfDataConsent'
import { ApplicationAssessmentForm } from './ApplicationAssessmentForm'
import { useQuery } from '@tanstack/react-query'
import { CourseIteration } from '../interface/courseIteration'
import { Query } from '../state/query'
import { getCourseIterationsWithOpenApplicationPeriod } from '../network/courseIteration'
import { postApplication } from '../network/application'
import { useDefaultApplicationForm } from './hooks/useDefaultApplicationForm'

interface CoachApplicationFormProps {
  coachApplication?: Application
  accessMode: ApplicationFormAccessMode
  onSuccess: () => void
}

export const CoachApplicationForm = ({
  accessMode,
  coachApplication,
  onSuccess,
}: CoachApplicationFormProps): JSX.Element => {
  const [applicationSuccessfullySubmitted, setApplicationSuccessfullySubmitted] = useState(false)
  const defaultForm = useDefaultApplicationForm(coachApplication)

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

  const { data: courseIteration, isLoading } = useQuery<CourseIteration | undefined>({
    queryKey: [Query.COURSE_ITERATION, ApplicationType.COACH],
    enabled: accessMode === ApplicationFormAccessMode.STUDENT,
    queryFn: () => getCourseIterationsWithOpenApplicationPeriod(ApplicationType.COACH),
  })

  return (
    <>
      {isLoading ? (
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
          {courseIteration ?? accessMode === ApplicationFormAccessMode.INSTRUCTOR ? (
            <Box
              style={{
                display: 'flex',
                flexDirection: 'column',
                maxWidth: '60vw',
                gap: '2vh',
              }}
              mx='auto'
            >
              {applicationSuccessfullySubmitted ? (
                <ApplicationSuccessfulSubmission
                  title='Your application was successfully submitted!'
                  text='Please prioritize the iPraktikum course as 1st priority in the Matching tool.'
                />
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
                        {...consentForm.getInputProps('dataConsent', {
                          type: 'checkbox',
                        })}
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
                        label={`I am aware that the Agile Project Mamagement is a very demanding 10 ECTS 
                        practical course and I agree to put in the required amount of work, time and effort.`}
                        {...consentForm.getInputProps('workloadConsent', {
                          type: 'checkbox',
                        })}
                      />
                      <Group align='right' mt='md'>
                        <Button
                          disabled={
                            !defaultForm.isValid() ||
                            !coachForm.isValid() ||
                            (!consentForm.isValid() &&
                              accessMode === ApplicationFormAccessMode.STUDENT)
                          }
                          type='submit'
                          onClick={() => {
                            if (
                              defaultForm.isValid() &&
                              coachForm.isValid() &&
                              courseIteration &&
                              !coachApplication
                            ) {
                              postApplication(
                                ApplicationType.COACH,
                                {
                                  ...defaultForm.values,
                                  ...coachForm.values,
                                },
                                courseIteration.semesterName,
                              )
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
                    </Stack>
                  )}
                  {accessMode === ApplicationFormAccessMode.INSTRUCTOR && coachApplication && (
                    <ApplicationAssessmentForm
                      applicationId={coachApplication.id}
                      student={coachApplication.student}
                      assessment={coachApplication.assessment}
                      applicationType={ApplicationType.COACH}
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
