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
import { useForm } from '@mantine/form'
import LS1Logo from '../static/ls1logo.png'
import { useEffect, useState } from 'react'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import {
  type StudentApplicationPatch,
  type StudentApplication,
} from '../redux/studentApplicationSlice/studentApplicationSlice'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../redux/store'
import { createStudentApplicationNote } from '../redux/studentApplicationSlice/thunks/createStudentApplicationNote'
import { createStudentApplication } from '../redux/studentApplicationSlice/thunks/createStudentApplication'
import { fetchApplicationSemestersWithOpenApplicationPeriod } from '../redux/applicationSemesterSlice/thunks/fetchApplicationSemesters'
import { updateStudentApplication } from '../redux/studentApplicationSlice/thunks/updateStudentApplication'
import { StudentApplicationComment } from './StudentApplicationComment'

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
  const loading = useAppSelector((state) => state.applicationSemester.status)
  const [note, setNote] = useState('')
  const form = useForm<StudentApplication>({
    initialValues: studentApplication
      ? { ...studentApplication }
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
            gender: '',
          },
          studyDegree: '',
          studyProgram: '',
          currentSemester: '',
          motivation: '',
          experience: '',
          notes: [],
          suggestedAsCoach: false,
          suggestedAsTutor: false,
          blockedByPM: false,
          reasonForBlockedByPM: '',
          assessmentScore: 0,
          assessed: false,
          accepted: false,
          projectTeam: undefined,
        },
    validateInputOnBlur: true,
    validate: {
      student: {
        tumId: (value) =>
          /^[A-Za-z]{2}[0-9]{2}[A-Za-z]{3}$/.test(value) ? null : 'This is not a valid TUM ID',
        email: (value) => (/^\S+@\S+$/.test(value) ? null : 'Invalid email'),
      },
      motivation: (value) =>
        value.length <= 500 ? null : 'The maximum number of characters is 500',
      experience: (value) =>
        value.length <= 500 ? null : 'The maximum number of characters is 500',
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
              <form
                style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}
                onSubmit={form.onSubmit((values) => {
                  console.log(values)
                })}
              >
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
                    data={[
                      { value: 'M', label: 'Male' },
                      { value: 'F', label: 'Female' },
                      { value: '-', label: 'Prefer not to say' },
                    ]}
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
                    data={[
                      { value: 'ma', label: 'Master' },
                      { value: 'ba', label: 'Bachelor' },
                    ]}
                    {...form.getInputProps('studyDegree')}
                  />
                  <Select
                    withAsterisk
                    disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                    required
                    label='Study Program'
                    placeholder='Study Program'
                    data={[
                      { value: 'Information Systems', label: 'Information Systems' },
                      { value: 'Computer Science', label: 'Computer Science' },
                      { value: 'Game Engineering', label: 'Game Engineering' },
                      { value: 'Management and Technology', label: 'Management and Technology' },
                    ]}
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
                <MultiSelect
                  disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                  data={[
                    'Introduction to Software Engineering',
                    'Patterns in Software Engineering',
                  ]}
                  label='Courses Taken at the Chair'
                  placeholder='Courses Taken at the Chair'
                  {...form.getInputProps('coursesTaken')}
                />
                <MultiSelect
                  disabled={accessMode === StudentApplicationAccessMode.INSTRUCTOR}
                  data={['MacBook', 'iPhone', 'iPad', 'iWatch']}
                  label='Available Devices'
                  placeholder='Available Devices'
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
                        {...form.getInputProps('suggestedAsCoach', { type: 'checkbox' })}
                      />
                      <Checkbox
                        mt='md'
                        label='Suggested as Tutor'
                        {...form.getInputProps('suggestedAsTutor', { type: 'checkbox' })}
                      />
                      <Checkbox
                        mt='md'
                        label='Blocked by PM'
                        {...form.getInputProps('blockedByPM', { type: 'checkbox' })}
                      />
                    </Group>
                    {form.values.blockedByPM && (
                      <Textarea
                        autosize
                        label='Reason for Blocked by PM'
                        placeholder='Reason for blocked by PM'
                        minRows={5}
                        {...form.getInputProps('reasonForBlockedByPM')}
                      />
                    )}
                    <TextInput
                      withAsterisk
                      type='number'
                      label='Assessment Score'
                      placeholder='Assessment Score'
                      {...form.getInputProps('assessmentScore')}
                    />
                    <Group grow style={{ alignItems: 'center' }}>
                      <Checkbox
                        mt='md'
                        label='Accepted for the Course'
                        {...form.getInputProps('accepted', { type: 'checkbox' })}
                      />
                      <Checkbox
                        mt='md'
                        label='Student Application Assessed'
                        {...form.getInputProps('assessed', { type: 'checkbox' })}
                      />
                    </Group>
                    <Divider />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
                      <Text fz='sm' weight={500}>
                        Additional Notes
                      </Text>
                      {form.values.notes.map((note) => (
                        /* <Paper
                          key={note.id ?? note.comment}
                          withBorder
                          radius='md'
                          style={{
                            padding: '2vh 3vw',
                            display: 'flex',
                            flexDirection: 'row',
                            gap: '3vw',
                          }}
                        >
                          <Group style={{ width: '16vw' }}>
                            <Avatar radius='xl'>{`${
                              note.author.username?.substring(0, 2) ?? ''
                            }`}</Avatar>
                            <div>
                              <Text fz='sm'>{note.author.username}</Text>
                              <Text fz='xs' c='dimmed'>
                                {note.timestamp}
                              </Text>
                            </div>
                          </Group>
                          <Divider orientation='vertical' />
                          <Text fz='sm'>{note.comment}</Text>
                        </Paper> */
                        <div key={note.id}>
                          <StudentApplicationComment studentApplicationComment={note} />
                        </div>
                      ))}
                    </div>
                    <Group position='left' style={{ alignItems: 'flex-end' }}>
                      <Textarea
                        autosize
                        placeholder='Note'
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
                              notes: [
                                ...form.values.notes,
                                {
                                  author: {
                                    id: localStorage.getItem('user_id') ?? '',
                                  },
                                  comment: note,
                                },
                              ],
                            })
                            setNote('')
                            if (studentApplication) {
                              // eslint-disable-next-line @typescript-eslint/no-floating-promises
                              dispatch(
                                createStudentApplicationNote({
                                  studentApplicationId: studentApplication?.id,
                                  studentApplicationNote: {
                                    author: {
                                      id: localStorage.getItem('user_id') ?? '',
                                    },
                                    comment: note,
                                  },
                                }),
                              )
                            }
                          }
                        }}
                      >
                        Add Note
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
                        const studentApplicationPatchObjectArray: StudentApplicationPatch[] = []
                        Object.keys(form.values).forEach((key) => {
                          const studentApplicationPatchObject = new Map()
                          studentApplicationPatchObject.set('op', 'replace')
                          studentApplicationPatchObject.set('path', '/' + key)
                          studentApplicationPatchObject.set('value', form.getInputProps(key).value)
                          const obj = Object.fromEntries(studentApplicationPatchObject)
                          studentApplicationPatchObjectArray.push(obj)
                        })
                        void dispatch(
                          updateStudentApplication({
                            studentApplicationId: studentApplication.id,
                            studentApplicationPatch: studentApplicationPatchObjectArray,
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
