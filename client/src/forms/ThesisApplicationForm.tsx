import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import {
  ResearchArea,
  FocusTopic,
  type ThesisApplication,
} from '../redux/thesisApplicationsSlice/thesisApplicationsSlice'
import {
  ActionIcon,
  Box,
  Button,
  Card,
  Center,
  Checkbox,
  Divider,
  Group,
  Image,
  Loader,
  LoadingOverlay,
  MultiSelect,
  Select,
  Spoiler,
  Stack,
  Text,
  TextInput,
  Textarea,
  Title,
  rem,
  useMantineTheme,
} from '@mantine/core'
import { Gender, StudyDegree, StudyProgram } from '../redux/applicationsSlice/applicationsSlice'
import { ApplicationFormAccessMode } from './DefaultApplicationForm'
import { DeclarationOfDataConsent } from './DeclarationOfDataConsent'
import { IconCalendar, IconPhoto, IconUpload, IconX } from '@tabler/icons-react'
import LS1Logo from '../static/ls1logo.png'
import {
  createThesisApplication,
  loadThesisApplicationBachelorReportFile,
  loadThesisApplicationCvFile,
  loadThesisApplicationExaminationFile,
} from '../service/thesisApplicationService'
import { DatePickerInput } from '@mantine/dates'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../redux/store'
import { assessThesisApplication } from '../redux/thesisApplicationsSlice/thunks/assessThesisApplication'
import { notifications } from '@mantine/notifications'
import { useDisclosure } from '@mantine/hooks'
import { ApplicationSuccessfulSubmission } from '../student/StudentApplicationSubmissionPage/ApplicationSuccessfulSubmission'
import { useEffect, useState } from 'react'
import { rejectThesisApplication } from '../redux/thesisApplicationsSlice/thunks/rejectThesisApplication'
import { acceptThesisApplication } from '../redux/thesisApplicationsSlice/thunks/acceptThesisApplication'
import { assignThesisAdvisor } from '../redux/thesisApplicationsSlice/thunks/assignThesisAdvisor'

countries.registerLocale(enLocale)
const countriesArr = Object.entries(countries.getNames('en', { select: 'alias' })).map(
  ([key, value]) => {
    return {
      label: value,
      value: key,
    }
  },
)

interface ThesisApplicationFormProps {
  accessMode: ApplicationFormAccessMode
  application?: ThesisApplication
}

export const ThesisApplicationForm = ({
  application,
  accessMode,
}: ThesisApplicationFormProps): JSX.Element => {
  const theme = useMantineTheme()
  const dispatch = useDispatch<AppDispatch>()
  const { thesisAdvisors, status: thesisAppliccationsSliceState } = useAppSelector(
    (state) => state.thesisApplications,
  )
  const [loadingOverlayVisible, loadingOverlayHandlers] = useDisclosure(false)
  const [applicationSuccessfullySubmitted, setApplicationSuccessfullySubmitted] = useState(false)
  const uploads = useForm<{
    examinationReport: File | undefined
    cv: File | undefined
    bachelorReport: File | undefined
  }>({
    initialValues: {
      examinationReport: undefined,
      cv: undefined,
      bachelorReport: undefined,
    },
    validate: {
      examinationReport: (value) => {
        if (!value) {
          return 'Please upload your examination report.'
        } else if (value && value.size > 1 * 1024 ** 2) {
          return 'The file should not exceed 3mb'
        }
      },
      cv: (value) => {
        if (!value) {
          return 'Please upload your CV.'
        } else if (value && value.size > 1 * 1024 ** 2) {
          return 'The file should not exceed 3mb'
        }
      },
    },
  })
  const form = useForm<ThesisApplication>({
    initialValues: application
      ? {
          ...application,
          desiredThesisStart: new Date(application.desiredThesisStart),
          assessmentComment: application.assessmentComment ?? '',
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
          start: '',
          specialSkills: '',
          researchAreas: [],
          focusTopics: [],
          motivation: '',
          projects: '',
          interests: '',
          thesisTitle: '',
          desiredThesisStart: new Date(),
          applicationStatus: 'NOT_ASSESSED',
          assessmentComment: '',
        },
    validateInputOnChange: ['student.tumId'],
    validateInputOnBlur: true,
    validate: {
      student: {
        tumId: (value, values) =>
          /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{3}$/.test(value ?? '') || values.student?.isExchangeStudent
            ? null
            : 'This is not a valid TUM ID',
        matriculationNumber: (value, values) =>
          /^[0-9]+$/.test(value ?? '') || values.student?.isExchangeStudent
            ? null
            : 'This is not a valid matriculation number.',
        firstName: isNotEmpty('Please state your first name.'),
        lastName: isNotEmpty('Please state your last name'),
        email: isEmail('Invalid email'),
        gender: isNotEmpty('Please state your gender.'),
        nationality: isNotEmpty('Please state your nationality.'),
      },
      motivation: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please state your motivation for the thesis.'
        } else if (value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
      },
      specialSkills: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please state your special skills.'
        } else if (value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
      },
      interests: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please state your interests.'
        } else if (value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
      },
      projects: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please state your projects.'
        } else if (value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
      },
      thesisTitle: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please state your thesis title suggestion.'
        } else if (value.length > 200) {
          return 'The maximum allowed number of characters is 200.'
        }
      },
      studyDegree: isNotEmpty('Please state your study degree.'),
      studyProgram: isNotEmpty('Please state your study program.'),
      currentSemester: (value) => {
        return !value || value.length === 0 || !/\b([1-9]|[1-9][0-9])\b/.test(value)
          ? 'Please state your current semester.'
          : null
      },
    },
  })
  const consentForm = useForm({
    initialValues: {
      declarationOfConsentAccepted: false,
    },
    validateInputOnChange: true,
    validate: {
      declarationOfConsentAccepted: (value) => !value,
    },
  })
  const [thesisAdvisorId, setThesisAdvisorId] = useState<string | null>(
    application?.thesisAdvisor?.id ?? null,
  )

  useEffect(() => {
    setThesisAdvisorId(application?.thesisAdvisor?.id ?? null)
  }, [application])

  return (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        maxWidth: '80vw',
        gap: '2vh',
      }}
      mx='auto'
      pos='relative'
    >
      <LoadingOverlay visible={loadingOverlayVisible} overlayProps={{ blur: 2 }} />
      {applicationSuccessfullySubmitted ? (
        <ApplicationSuccessfulSubmission
          title='Your application was successfully submitted!'
          text='We will contact you as soon as we have reviewed your application.'
        />
      ) : (
        <Stack>
          {accessMode === ApplicationFormAccessMode.STUDENT && (
            <Group
              style={{
                display: 'flex',
                flexDirection: 'row',
                justifyContent: 'center',
              }}
            >
              <div
                style={{
                  width: '15vw',
                  height: '15vw',
                }}
              >
                <Image src={LS1Logo} alt='LS1 Logo' />
              </div>
              <Center>
                <Title order={3}>Thesis Application at LS1 Chair</Title>
              </Center>
            </Group>
          )}
          <form style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
            <Group grow align='center'>
              <TextInput
                withAsterisk={!form.values.student?.isExchangeStudent}
                required={!form.values.student?.isExchangeStudent}
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                label='TUM ID'
                placeholder='TUM ID'
                {...form.getInputProps('student.tumId')}
              />
              <TextInput
                withAsterisk={!form.values.student?.isExchangeStudent}
                required={!form.values.student?.isExchangeStudent}
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                label='Matriculation Number'
                placeholder='Matriculation number'
                {...form.getInputProps('student.matriculationNumber')}
              />
            </Group>
            <Group grow>
              <TextInput
                withAsterisk
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                required
                label='First name'
                placeholder='First Name'
                {...form.getInputProps('student.firstName')}
              />
              <TextInput
                withAsterisk
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                required
                label='Last name'
                placeholder='Last Name'
                {...form.getInputProps('student.lastName')}
              />
            </Group>
            <Group grow>
              <Select
                withAsterisk
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                required
                label='Gender'
                placeholder='Gender'
                data={Object.keys(Gender).map((key) => {
                  return {
                    label: Gender[key as keyof typeof Gender],
                    value: key,
                  }
                })}
                {...form.getInputProps('student.gender')}
              />
              <Select
                withAsterisk
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                required
                searchable
                label='Nationality'
                placeholder='Nationality'
                data={countriesArr}
                {...form.getInputProps('student.nationality')}
              />
            </Group>
            <TextInput
              withAsterisk
              disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
              required
              label='Email (preferrably a TUM email address)'
              placeholder='your@email.com'
              {...form.getInputProps('student.email')}
            />
            <Group grow>
              <Select
                withAsterisk
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                required
                label='Study Degree'
                placeholder='Study Degree'
                data={Object.keys(StudyDegree).map((key) => {
                  return {
                    label: StudyDegree[key as keyof typeof StudyDegree],
                    value: key,
                  }
                })}
                {...form.getInputProps('studyDegree')}
              />
              <Select
                withAsterisk
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                required
                label='Study Program'
                placeholder='Study Program'
                data={Object.keys(StudyProgram).map((key) => {
                  return {
                    label: StudyProgram[key as keyof typeof StudyProgram],
                    value: key,
                  }
                })}
                {...form.getInputProps('studyProgram')}
              />
              <TextInput
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                onWheel={(e) => {
                  e.currentTarget.blur()
                }}
                withAsterisk
                required
                type='number'
                min={0}
                max={99}
                placeholder='Current semester'
                label='Current Semester'
                {...form.getInputProps('currentSemester')}
              />
            </Group>
            <Group grow>
              <div>
                <Textarea
                  label='Special Skills'
                  disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                  autosize
                  minRows={5}
                  placeholder='Programming languages, certificates, etc.'
                  withAsterisk
                  required
                  {...form.getInputProps('specialSkills')}
                />
                {!form.errors.specialSkills &&
                  accessMode !== ApplicationFormAccessMode.INSTRUCTOR && (
                    <Text fz='xs' ta='right'>{`${
                      form.values.specialSkills?.length ?? 0
                    } / 500`}</Text>
                  )}
              </div>
              <div>
                <Textarea
                  label='Motivation'
                  disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                  autosize
                  minRows={5}
                  placeholder='What are you looking for?'
                  withAsterisk
                  required
                  {...form.getInputProps('motivation')}
                />
                {!form.errors.motivation && accessMode !== ApplicationFormAccessMode.INSTRUCTOR && (
                  <Text fz='xs' ta='right'>{`${form.values.motivation?.length ?? 0} / 500`}</Text>
                )}
              </div>
            </Group>
            <Group grow>
              <div>
                <Textarea
                  label='Interests'
                  disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                  autosize
                  minRows={5}
                  placeholder='What are you interested in?'
                  withAsterisk
                  required
                  {...form.getInputProps('interests')}
                />
                {!form.errors.interests && accessMode !== ApplicationFormAccessMode.INSTRUCTOR && (
                  <Text fz='xs' ta='right'>{`${form.values.interests?.length ?? 0} / 500`}</Text>
                )}
              </div>
              <div>
                <Textarea
                  label='Projects'
                  disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                  autosize
                  minRows={5}
                  placeholder='What projects have you worked on?'
                  withAsterisk
                  required
                  {...form.getInputProps('projects')}
                />
                {!form.errors.projects && accessMode !== ApplicationFormAccessMode.INSTRUCTOR && (
                  <Text fz='xs' ta='right'>{`${form.values.projects?.length ?? 0} / 500`}</Text>
                )}
              </div>
            </Group>
            <div>
              <Textarea
                label='Thesis Title Suggestion'
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                autosize
                minRows={5}
                placeholder='Thesis title suggestion'
                withAsterisk
                required
                {...form.getInputProps('thesisTitle')}
              />
              {!form.errors.thesisTitle && accessMode !== ApplicationFormAccessMode.INSTRUCTOR && (
                <Text fz='xs' ta='right'>{`${form.values.thesisTitle?.length ?? 0} / 200`}</Text>
              )}
            </div>
            <DatePickerInput
              disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
              leftSection={<IconCalendar />}
              label='Desired Thesis Start Date'
              {...form.getInputProps('desiredThesisStart')}
            />
            <Group grow>
              <MultiSelect
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                data={Object.keys(ResearchArea).map((key) => {
                  return {
                    label: ResearchArea[key as keyof typeof ResearchArea],
                    value: key,
                  }
                })}
                label='Research Areas'
                placeholder='Research areas'
                {...form.getInputProps('researchAreas')}
              />
              <MultiSelect
                disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
                data={Object.keys(FocusTopic).map((key) => {
                  return {
                    label: FocusTopic[key as keyof typeof FocusTopic],
                    value: key,
                  }
                })}
                label='Focus Topics'
                placeholder='Focus topics'
                {...form.getInputProps('focusTopics')}
              />
            </Group>
            {accessMode === ApplicationFormAccessMode.STUDENT && (
              <Stack>
                <Group align='left'>
                  <Text fw={500} fz='sm'>
                    Examination Report
                  </Text>
                  <Text color='red'>*</Text>
                </Group>
                {uploads.values.examinationReport && (
                  <Card shadow='sm' withBorder>
                    <Group align='apart'>
                      <Text c='dimmed' fz='sm'>
                        {uploads.values.examinationReport.name}
                      </Text>
                      <ActionIcon
                        onClick={() => {
                          uploads.setValues({ examinationReport: undefined })
                        }}
                      >
                        <IconX />
                      </ActionIcon>
                    </Group>
                  </Card>
                )}
                {!uploads.values.examinationReport && (
                  <Dropzone
                    name='Examination Report'
                    disabled={!!uploads.values.examinationReport}
                    onDrop={(files) => {
                      if (files[0]) {
                        uploads.setValues({
                          examinationReport: files[0],
                        })
                      }
                    }}
                    onReject={() => {
                      notifications.show({
                        color: 'red',
                        autoClose: 5000,
                        title: 'Error',
                        message: `Failed upload file. Please make sure the file is a PDF and does not exceed 1mb.`,
                      })
                    }}
                    maxSize={1 * 1024 ** 2}
                    accept={PDF_MIME_TYPE}
                  >
                    <Group
                      align='center'
                      gap='xl'
                      style={{ minHeight: rem(220), pointerEvents: 'none' }}
                    >
                      <Dropzone.Accept>
                        <IconUpload
                          size='3.2rem'
                          stroke={1.5}
                          color={theme.colors[theme.primaryColor][4]}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX size='3.2rem' stroke={1.5} color={theme.colors.red[4]} />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconPhoto size='3.2rem' stroke={1.5} />
                      </Dropzone.Idle>

                      <div>
                        <Text size='xl' inline>
                          Drag the file here or click to select file
                        </Text>
                        <Text size='sm' color='dimmed' inline mt={7}>
                          The file should not exceed 1mb
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                )}
                <Group align='left'>
                  <Text fw={500} fz='sm'>
                    CV
                  </Text>
                  <Text color='red'>*</Text>
                </Group>
                {uploads.values.cv && (
                  <Card shadow='sm' withBorder>
                    <Group align='apart'>
                      <Text c='dimmed' fz='sm'>
                        {uploads.values.cv.name}
                      </Text>
                      <ActionIcon
                        onClick={() => {
                          uploads.setValues({ cv: undefined })
                        }}
                      >
                        <IconX />
                      </ActionIcon>
                    </Group>
                  </Card>
                )}
                {!uploads.values.cv && (
                  <Dropzone
                    name='CV'
                    disabled={!!uploads.values.cv}
                    onDrop={(files) => {
                      if (files[0]) {
                        uploads.setValues({
                          cv: files[0],
                        })
                      }
                    }}
                    onReject={() => {
                      notifications.show({
                        color: 'red',
                        autoClose: 5000,
                        title: 'Error',
                        message: `Failed upload file. Please make sure the file is a PDF and does not exceed 1mb.`,
                      })
                    }}
                    maxSize={1 * 1024 ** 2}
                    accept={PDF_MIME_TYPE}
                  >
                    <Group
                      align='center'
                      gap='xl'
                      style={{ minHeight: rem(220), pointerEvents: 'none' }}
                    >
                      <Dropzone.Accept>
                        <IconUpload
                          size='3.2rem'
                          stroke={1.5}
                          color={theme.colors[theme.primaryColor][4]}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX size='3.2rem' stroke={1.5} color={theme.colors.red[4]} />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconPhoto size='3.2rem' stroke={1.5} />
                      </Dropzone.Idle>

                      <div>
                        <Text size='xl' inline>
                          Drag the file here or click to select file
                        </Text>
                        <Text size='sm' color='dimmed' inline mt={7}>
                          The file should not exceed 1mb
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                )}
                <Text fw={500} fz='sm'>
                  Bachelor Report
                </Text>
                {uploads.values.bachelorReport && (
                  <Card shadow='sm' withBorder>
                    <Group align='apart'>
                      <Text c='dimmed' fz='sm'>
                        {uploads.values.bachelorReport.name}
                      </Text>
                      <ActionIcon
                        onClick={() => {
                          uploads.setValues({ bachelorReport: undefined })
                        }}
                      >
                        <IconX />
                      </ActionIcon>
                    </Group>
                  </Card>
                )}
                {!uploads.values.bachelorReport && (
                  <Dropzone
                    name='Bachelor Report'
                    disabled={!!uploads.values.bachelorReport}
                    onDrop={(files) => {
                      if (files[0]) {
                        uploads.setValues({
                          bachelorReport: files[0],
                        })
                      }
                    }}
                    onReject={() => {
                      notifications.show({
                        color: 'red',
                        autoClose: 5000,
                        title: 'Error',
                        message: `Failed upload file. Please make sure the file is a PDF and does not exceed 1mb.`,
                      })
                    }}
                    maxSize={1 * 1024 ** 2}
                    accept={PDF_MIME_TYPE}
                  >
                    <Group
                      align='center'
                      gap='xl'
                      style={{ minHeight: rem(220), pointerEvents: 'none' }}
                    >
                      <Dropzone.Accept>
                        <IconUpload
                          size='3.2rem'
                          stroke={1.5}
                          color={theme.colors[theme.primaryColor][4]}
                        />
                      </Dropzone.Accept>
                      <Dropzone.Reject>
                        <IconX size='3.2rem' stroke={1.5} color={theme.colors.red[4]} />
                      </Dropzone.Reject>
                      <Dropzone.Idle>
                        <IconPhoto size='3.2rem' stroke={1.5} />
                      </Dropzone.Idle>

                      <div>
                        <Text size='xl' inline>
                          Drag the file here or click to select file
                        </Text>
                        <Text size='sm' color='dimmed' inline mt={7}>
                          The file should not exceed 1mb
                        </Text>
                      </div>
                    </Group>
                  </Dropzone>
                )}
              </Stack>
            )}
          </form>
          {accessMode === ApplicationFormAccessMode.INSTRUCTOR && (
            <>
              <Divider
                label={
                  <Text c='white' fw='500'>
                    Uploaded Files
                  </Text>
                }
                labelPosition='center'
              />
              <Group grow>
                {application?.examinationReportFilename && (
                  <Button
                    onClick={() => {
                      void (async () => {
                        const response = await loadThesisApplicationExaminationFile(application.id)
                        if (response) {
                          const url = window.URL.createObjectURL(response)
                          const a = document.createElement('a')
                          a.href = url
                          a.setAttribute(
                            'download',
                            `${application.examinationReportFilename ?? ''}.pdf`,
                          )
                          document.body.appendChild(a)
                          a.click()
                          window.URL.revokeObjectURL(url)
                        }
                      })()
                    }}
                  >
                    Download Examination Report
                  </Button>
                )}
                {application?.cvFilename && (
                  <Button
                    onClick={() => {
                      void (async () => {
                        const response = await loadThesisApplicationCvFile(application.id)
                        if (response) {
                          const url = window.URL.createObjectURL(response)
                          const a = document.createElement('a')
                          a.href = url
                          a.setAttribute('download', `${application.cvFilename ?? ''}.pdf`)
                          document.body.appendChild(a)
                          a.click()
                          window.URL.revokeObjectURL(url)
                        }
                      })()
                    }}
                  >
                    Download CV
                  </Button>
                )}
                {application?.bachelorReportFilename && (
                  <Button
                    onClick={() => {
                      void (async () => {
                        const response = await loadThesisApplicationBachelorReportFile(
                          application.id,
                        )
                        if (response) {
                          const url = window.URL.createObjectURL(response)
                          const a = document.createElement('a')
                          a.href = url
                          a.setAttribute(
                            'download',
                            `${application.bachelorReportFilename ?? ''}.pdf`,
                          )
                          document.body.appendChild(a)
                          a.click()
                          window.URL.revokeObjectURL(url)
                        }
                      })()
                    }}
                  >
                    Download Bachelor Report
                  </Button>
                )}
              </Group>
              <Divider />
            </>
          )}
          {accessMode === ApplicationFormAccessMode.INSTRUCTOR && (
            <>
              <Select
                label='Thesis Advisor'
                data={thesisAdvisors.map((ta) => {
                  return {
                    value: ta.id ?? '',
                    label: `${ta.firstName} ${ta.lastName} (${ta.tumId})`,
                  }
                })}
                value={thesisAdvisorId}
                onChange={(value) => {
                  setThesisAdvisorId(value)
                  if (application && value) {
                    void dispatch(
                      assignThesisAdvisor({
                        thesisApplicationId: application?.id,
                        thesisAdvisorId: value,
                      }),
                    )
                  }
                }}
              />
              <Textarea
                label='Comment'
                autosize
                minRows={5}
                placeholder='Comment'
                {...form.getInputProps('assessmentComment')}
              />
              {accessMode === ApplicationFormAccessMode.INSTRUCTOR && (
                <Button
                  onClick={() => {
                    if (application) {
                      void dispatch(
                        assessThesisApplication({
                          thesisApplicationId: application.id,
                          assessment: {
                            status: form.values.applicationStatus,
                            assessmentComment: form.values.assessmentComment ?? '',
                          },
                        }),
                      )
                    }
                  }}
                >
                  Save
                </Button>
              )}
              <Group align='right'>
                <Button
                  style={{ width: '20vw' }}
                  variant='outline'
                  color='red'
                  disabled={thesisAppliccationsSliceState === 'pending'}
                  onClick={() => {
                    if (application) {
                      void dispatch(rejectThesisApplication(application.id))
                    }
                  }}
                >
                  {thesisAppliccationsSliceState === 'pending' ? <Loader /> : 'Reject'}
                </Button>
                <Button
                  style={{ width: '20vw' }}
                  color='green'
                  disabled={
                    !application?.thesisAdvisor || thesisAppliccationsSliceState === 'pending'
                  }
                  onClick={() => {
                    if (application) {
                      void dispatch(acceptThesisApplication(application.id))
                    }
                  }}
                >
                  {thesisAppliccationsSliceState === 'pending' ? <Loader /> : 'Accept'}
                </Button>
              </Group>
            </>
          )}
          {accessMode === ApplicationFormAccessMode.STUDENT && (
            <>
              <Stack>
                <Checkbox
                  mt='md'
                  label='I have read the declaration of consent below and agree to the processing of my data.'
                  {...consentForm.getInputProps('declarationOfConsentAccepted', {
                    type: 'checkbox',
                  })}
                />
                <Spoiler
                  maxHeight={0}
                  showLabel={<Text fz='sm'>Show Declaration of Consent</Text>}
                  hideLabel={<Text fz='sm'>Hide</Text>}
                >
                  <DeclarationOfDataConsent />
                </Spoiler>
              </Stack>
              <Group>
                <Button
                  disabled={!form.isValid() || !consentForm.isValid() || !uploads.isValid()}
                  onClick={() => {
                    void (async () => {
                      loadingOverlayHandlers.open()
                      if (uploads.values.examinationReport && uploads.values.cv) {
                        const response = await createThesisApplication({
                          application: form.values,
                          examinationReport: uploads.values.examinationReport,
                          cv: uploads.values.cv,
                          bachelorReport: uploads.values.bachelorReport,
                        })
                        if (response) {
                          setApplicationSuccessfullySubmitted(true)
                        }
                      }
                    })().then(() => {
                      loadingOverlayHandlers.close()
                    })
                  }}
                >
                  Submit
                </Button>
              </Group>
            </>
          )}
        </Stack>
      )}
    </Box>
  )
}
