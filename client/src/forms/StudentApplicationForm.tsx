import {
  Box,
  Button,
  Checkbox,
  Divider,
  Group,
  Image,
  MultiSelect,
  Select,
  Textarea,
  TextInput,
  Title,
  Text,
  Container,
  Loader,
  Center,
} from '@mantine/core'
import { isNotEmpty, useForm } from '@mantine/form'
import LS1Logo from '../static/ls1logo.png'
import { useEffect, useState } from 'react'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import {
  type StudentApplication,
  LanguageProficiency,
  Gender,
  StudyDegree,
  StudyProgram,
  Device,
  Course,
} from '../redux/studentApplicationSlice/studentApplicationSlice'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../redux/store'
import { createInstructorComment } from '../redux/studentApplicationSlice/thunks/createInstructorComment'
import { createStudentApplication } from '../redux/studentApplicationSlice/thunks/createStudentApplication'
import { fetchApplicationSemestersWithOpenApplicationPeriod } from '../redux/applicationSemesterSlice/thunks/fetchApplicationSemesters'
import { StudentApplicationComment } from './StudentApplicationComment'
import { type Patch } from '../service/configService'
import { updateStudentApplicationAssessment } from '../redux/studentApplicationSlice/thunks/updateStudentApplicationAssessment'

export enum StudentApplicationAccessMode {
  INSTRUCTOR,
  STUDENT,
}

interface StudentApplicationFormProps {
  accessMode: StudentApplicationAccessMode
  studentApplication?: StudentApplication
  onSuccessfulSubmit: (values: StudentApplication) => void
}

countries.registerLocale(enLocale)
const countriesArr = Object.entries(countries.getNames('en', { select: 'official' })).map(
  ([key, value]) => {
    return {
      label: value,
      value: key,
    }
  },
)

export const StudentApplicationForm = ({
  accessMode,
  studentApplication,
  onSuccessfulSubmit,
}: StudentApplicationFormProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const openApplicationSemester = useAppSelector(
    (state) => state.applicationSemester.openApplicationSemester,
  )
  const auth = useAppSelector((state) => state.auth)
  const loading = useAppSelector((state) => state.applicationSemester.status)
  const [note, setNote] = useState('')
  const form = useForm<StudentApplication>({
    initialValues: studentApplication
      ? {
          ...studentApplication,
          studentApplicationAssessment: { ...studentApplication.studentApplicationAssessment },
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
          studentApplicationAssessment: {
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
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
        gender: isNotEmpty('Gender cannot be empty.'),
      },
      motivation: (value) =>
        value.length <= 500 ? null : 'The maximum number of characters is 500',
      experience: (value) =>
        value.length <= 500 ? null : 'The maximum number of characters is 500',
      englishLanguageProficiency: isNotEmpty('Please state your English language proficiency'),
      germanLanguageProficiency: isNotEmpty('Please state your German language proficiency'),
    },
  })

  useEffect(() => {
    void dispatch(fetchApplicationSemestersWithOpenApplicationPeriod())
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
        <div>
          {openApplicationSemester ? (
            <Box
              sx={{ display: 'flex', flexDirection: 'column', maxWidth: '60vw', gap: '2vh' }}
              mx='auto'
            >
              {accessMode === StudentApplicationAccessMode.STUDENT && (
                <Group style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
                  <div
                    style={{
                      width: '20vw',
                      height: '20vw',
                    }}
                  >
                    <Image src={LS1Logo} alt='LS1 Logo' />
                  </div>
                  <Title align='right'>Welcome to the application for the iPraktikum course!</Title>
                </Group>
              )}
              <form style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
                <Checkbox
                  mt='md'
                  disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                  label='Are you an exchange student?'
                  {...form.getInputProps('student.isExchangeStudent', { type: 'checkbox' })}
                />
                <Group grow align='center'>
                  <TextInput
                    withAsterisk
                    required={!form.values.student.isExchangeStudent}
                    disabled={
                      accessMode === StudentApplicationAccessMode.INSTRUCTOR ||
                      form.values.student.isExchangeStudent
                    }
                    label='TUM ID'
                    placeholder='TUM ID'
                    {...form.getInputProps('student.tumId')}
                  />
                  <TextInput
                    withAsterisk
                    required
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                    label='Matriculation Number'
                    placeholder='Matriculation number'
                    {...form.getInputProps('student.matriculationNumber')}
                  />
                </Group>
                <Group grow>
                  <TextInput
                    withAsterisk
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                    required
                    label='First name'
                    placeholder='First Name'
                    {...form.getInputProps('student.firstName')}
                  />
                  <TextInput
                    withAsterisk
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                    required
                    label='Last name'
                    placeholder='Last Name'
                    {...form.getInputProps('student.lastName')}
                  />
                </Group>
                <Group grow>
                  <Select
                    withAsterisk
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
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
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
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
                  disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                  required
                  label='Email'
                  placeholder='your@email.com'
                  {...form.getInputProps('student.email')}
                />
                <Group grow>
                  <Select
                    withAsterisk
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
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
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
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
                    withAsterisk
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                    required
                    type='number'
                    placeholder='Current semester'
                    label='Current Semester'
                    {...form.getInputProps('currentSemester')}
                  />
                </Group>
                <Group grow>
                  <Select
                    required
                    withAsterisk
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                    data={Object.keys(LanguageProficiency).map((key) => {
                      return {
                        label: LanguageProficiency[key as keyof typeof LanguageProficiency],
                        value: key,
                      }
                    })}
                    label='English Language Proficiency'
                    placeholder='English language proficiency'
                    {...form.getInputProps('englishLanguageProficiency')}
                  />
                  <Select
                    required
                    withAsterisk
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                    data={Object.keys(LanguageProficiency).map((key) => {
                      return {
                        label: LanguageProficiency[key as keyof typeof LanguageProficiency],
                        value: key,
                      }
                    })}
                    label='German Language Proficiency'
                    placeholder='German language proficiency'
                    {...form.getInputProps('germanLanguageProficiency')}
                  />
                </Group>
                <MultiSelect
                  disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                  data={Object.keys(Course).map((key) => {
                    return {
                      label: Course[key as keyof typeof Course],
                      value: key,
                    }
                  })}
                  label='Courses Taken at the Chair'
                  placeholder='Courses Taken at the Chair'
                  {...form.getInputProps('coursesTaken')}
                />
                <MultiSelect
                  disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                  data={Object.keys(Device).map((key) => {
                    return {
                      label: Device[key as keyof typeof Device],
                      value: key,
                    }
                  })}
                  label='Available Devices'
                  placeholder='Available Devices'
                  {...form.getInputProps('devices')}
                />
                <Textarea
                  label='Motivation'
                  disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                  autosize
                  minRows={5}
                  placeholder='Why do you want to participate in iPraktikum?'
                  withAsterisk
                  required
                  {...form.getInputProps('motivation')}
                />
                <Textarea
                  label='Experience'
                  disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                  autosize
                  minRows={5}
                  placeholder='What is your experience with Swift?'
                  withAsterisk
                  required
                  {...form.getInputProps('experience')}
                />
                {accessMode === StudentApplicationAccessMode.INSTRUCTOR && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
                    <Divider />
                    <Group grow>
                      <Checkbox
                        mt='md'
                        label='Suggested as Coach'
                        {...form.getInputProps('studentApplicationAssessment.suggestedAsCoach', {
                          type: 'checkbox',
                        })}
                      />
                      <Checkbox
                        mt='md'
                        label='Suggested as Tutor'
                        {...form.getInputProps('studentApplicationAssessment.suggestedAsTutor', {
                          type: 'checkbox',
                        })}
                      />
                      <Checkbox
                        mt='md'
                        label='Blocked by PM'
                        {...form.getInputProps('studentApplicationAssessment.blockedByPM', {
                          type: 'checkbox',
                        })}
                      />
                    </Group>
                    {form.values.studentApplicationAssessment.blockedByPM && (
                      <Textarea
                        autosize
                        label='Reason for Blocked by PM'
                        placeholder='Reason for blocked by PM'
                        minRows={5}
                        {...form.getInputProps('studentApplicationAssessment.reasonForBlockedByPM')}
                      />
                    )}
                    <TextInput
                      withAsterisk
                      type='number'
                      label='Assessment Score'
                      placeholder='Assessment Score'
                      {...form.getInputProps('studentApplicationAssessment.assessmentScore')}
                    />
                    <Group grow style={{ alignItems: 'center' }}>
                      <Checkbox
                        mt='md'
                        label='Accepted for the Course'
                        {...form.getInputProps('studentApplicationAssessment.accepted', {
                          type: 'checkbox',
                        })}
                      />
                      <Checkbox
                        mt='md'
                        label='Student Application Assessed'
                        {...form.getInputProps('studentApplicationAssessment.assessed', {
                          type: 'checkbox',
                        })}
                      />
                    </Group>
                    <Divider />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
                      <Text fz='sm' weight={500}>
                        Additional Notes
                      </Text>
                      {form.values.studentApplicationAssessment.instructorComments.map(
                        (comment) => (
                          <div key={`${comment.id ?? ''} ${comment.timestamp ?? ''}`}>
                            <StudentApplicationComment instructorComment={comment} />
                          </div>
                        ),
                      )}
                    </div>
                    <Group position='left' style={{ alignItems: 'flex-end' }}>
                      <Textarea
                        autosize
                        placeholder='Comment'
                        value={note}
                        onChange={(e) => {
                          setNote(e.target.value)
                        }}
                      />
                      <Button
                        onClick={() => {
                          if (note && note.length !== 0) {
                            form.setValues({
                              ...form.values,
                              studentApplicationAssessment: {
                                ...form.values.studentApplicationAssessment,
                                instructorComments: [
                                  ...form.values.studentApplicationAssessment.instructorComments,
                                  {
                                    author: auth ? `${auth.firstName} ${auth.lastName}` : '',
                                    text: note,
                                  },
                                ],
                              },
                            })
                            setNote('')
                            if (studentApplication) {
                              void dispatch(
                                createInstructorComment({
                                  studentApplicationId: studentApplication?.id,
                                  instructorComment: {
                                    author: auth ? `${auth.firstName} ${auth.lastName}` : '',
                                    text: note,
                                  },
                                }),
                              )
                            }
                          }
                        }}
                      >
                        Add Comment
                      </Button>
                    </Group>
                  </div>
                )}
                <Group position='right' mt='md'>
                  <Button
                    type='submit'
                    onClick={() => {
                      if (form.isValid() && openApplicationSemester && !studentApplication) {
                        void dispatch(
                          createStudentApplication({
                            studentApplication: form.values,
                            applicationSemester: openApplicationSemester.semesterName,
                          }),
                        )
                        onSuccessfulSubmit(form.values)
                      } else if (form.isValid() && studentApplication) {
                        // TODO: differentiate between assessment and student application changes
                        const studentApplicationAssessmentPatchObjectArray: Patch[] = []
                        Object.keys(form.values.studentApplicationAssessment).forEach((key) => {
                          if (form.isTouched('studentApplicationAssessment.' + key)) {
                            const studentApplicationPatchObject = new Map()
                            studentApplicationPatchObject.set('op', 'replace')
                            studentApplicationPatchObject.set('path', '/' + key)
                            studentApplicationPatchObject.set(
                              'value',
                              form.getInputProps('studentApplicationAssessment.' + key).value,
                            )
                            const obj = Object.fromEntries(studentApplicationPatchObject)
                            studentApplicationAssessmentPatchObjectArray.push(obj)
                          }
                        })
                        void dispatch(
                          updateStudentApplicationAssessment({
                            studentApplicationId: studentApplication.id,
                            studentApplicationAssessmentPatch:
                              studentApplicationAssessmentPatchObjectArray,
                          }),
                        )
                        onSuccessfulSubmit(form.values)
                      }
                    }}
                  >
                    Submit
                  </Button>
                </Group>
              </form>
            </Box>
          ) : (
            <Container>
              <Text>Application period is closed.</Text>
            </Container>
          )}
        </div>
      )}
    </>
  )
}
