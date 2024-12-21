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
  Title,
} from '@mantine/core'
import { ApplicationFormAccessMode, DefaultApplicationForm } from './DefaultApplicationForm'
import { useForm } from '@mantine/form'
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

export interface DeveloperApplicationFormProps {
  developerApplication?: Application
  accessMode: ApplicationFormAccessMode
  onSuccess: () => void
}

export const DeveloperApplicationForm = ({
  accessMode,
  developerApplication,
  onSuccess,
}: DeveloperApplicationFormProps): JSX.Element => {
  const [applicationSuccessfullySubmitted, setApplicationSuccessfullySubmitted] = useState(false)
  const form = useDefaultApplicationForm(developerApplication)

  const consentForm = useForm({
    initialValues: {
      dataConsent: false,
      introCourseConsent: false,
      workloadConsent: false,
      codingChallengeConsent: false,
    },
    validateInputOnChange: true,
    validate: {
      dataConsent: (value) => !value,
      introCourseConsent: (value) => !value,
      workloadConsent: (value) => !value,
      codingChallengeConsent: (value) => !value,
    },
  })

  const { data: courseIteration, isLoading } = useQuery<CourseIteration | undefined>({
    queryKey: [Query.COURSE_ITERATION, ApplicationType.DEVELOPER],
    enabled: accessMode === ApplicationFormAccessMode.STUDENT,
    queryFn: () => getCourseIterationsWithOpenApplicationPeriod(ApplicationType.DEVELOPER),
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
                    form={form}
                    title='Application for iPraktikum Practical Course'
                  />
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
                        label={
                          <Text>
                            I am aware that I have to take part and pass the on-site iPraktikum
                            intro course. The course will take place before the semester starts. The
                            exact dates are listed on our{' '}
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
                        {...consentForm.getInputProps('introCourseConsent', {
                          type: 'checkbox',
                        })}
                      />
                      <Checkbox
                        mt='md'
                        label={`I am aware that the iPraktikum is a very demanding 10 ECTS 
                        practical course and I agree to put in the required amount of work, time and effort.`}
                        {...consentForm.getInputProps('workloadConsent', {
                          type: 'checkbox',
                        })}
                      />
                      <Checkbox
                        label={
                          <Text>
                            I am aware that I have to solve a coding challenge linked on our{' '}
                            <Anchor
                              href='https://ase.cit.tum.de/ios'
                              target='_blank'
                              variant='blue'
                            >
                              website
                            </Anchor>
                          </Text>
                        }
                        mt='md'
                        {...consentForm.getInputProps('codingChallengeConsent', {
                          type: 'checkbox',
                        })}
                      />
                      <Group align='right' mt='md'>
                        <Button
                          type='submit'
                          disabled={
                            !form.isValid() ||
                            (!consentForm.isValid() &&
                              accessMode === ApplicationFormAccessMode.STUDENT)
                          }
                          onClick={() => {
                            if (form.isValid() && courseIteration && !developerApplication) {
                              postApplication(
                                ApplicationType.DEVELOPER,
                                form.values,
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
                  {accessMode === ApplicationFormAccessMode.INSTRUCTOR && developerApplication && (
                    <ApplicationAssessmentForm
                      applicationId={developerApplication.id}
                      student={developerApplication.student}
                      assessment={developerApplication.assessment}
                      applicationType={ApplicationType.DEVELOPER}
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
