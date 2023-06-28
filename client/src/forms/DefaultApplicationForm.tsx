import {
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
} from '@mantine/core'
import { type UseFormReturnType } from '@mantine/form'
import LS1Logo from '../static/ls1logo.png'
import { useState } from 'react'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import {
  LanguageProficiency,
  Gender,
  StudyDegree,
  StudyProgram,
  Device,
  Course,
  type Application,
} from '../redux/applicationsSlice/applicationsSlice'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../redux/store'
import { createInstructorComment } from '../redux/applicationsSlice/thunks/createInstructorComment'
import { StudentApplicationComment } from './StudentApplicationComment'

export enum ApplicationFormAccessMode {
  INSTRUCTOR,
  STUDENT,
}

interface StudentApplicationFormProps {
  title: string
  accessMode: ApplicationFormAccessMode
  application?: Application
  form: UseFormReturnType<Application, (values: Application) => Application>
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

export const DefaultApplicationForm = ({
  title,
  accessMode,
  application: studentApplication,
  form,
}: StudentApplicationFormProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const auth = useAppSelector((state) => state.auth)
  const [note, setNote] = useState('')

  return (
    <>
      {accessMode === ApplicationFormAccessMode.STUDENT && (
        <Group style={{ display: 'flex', flexDirection: 'row', justifyContent: 'center' }}>
          <div
            style={{
              width: '15vw',
              height: '15vw',
            }}
          >
            <Image src={LS1Logo} alt='LS1 Logo' />
          </div>
          <Title align='center' order={3}>
            {title}
          </Title>
        </Group>
      )}
      <form style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
        <Checkbox
          mt='md'
          disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
          label='Are you an exchange student?'
          {...form.getInputProps('student.isExchangeStudent', { type: 'checkbox' })}
        />
        <Group grow align='center'>
          <TextInput
            withAsterisk={!form.values.student.isExchangeStudent}
            required={!form.values.student.isExchangeStudent}
            disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
            label='TUM ID'
            placeholder='TUM ID'
            {...form.getInputProps('student.tumId')}
          />
          <TextInput
            withAsterisk={!form.values.student.isExchangeStudent}
            required={!form.values.student.isExchangeStudent}
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
            withAsterisk
            disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
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
          <Select
            required
            withAsterisk
            disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
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
            disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
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
          disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
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
          disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
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
          disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
          autosize
          minRows={5}
          placeholder='Why do you want to participate in iPraktikum?'
          withAsterisk
          required
          {...form.getInputProps('motivation')}
        />
        <Textarea
          label='Experience'
          disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
          autosize
          minRows={5}
          placeholder='What is your experience with Swift?'
          withAsterisk
          required
          {...form.getInputProps('experience')}
        />
        {accessMode === ApplicationFormAccessMode.INSTRUCTOR && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
            <Divider />
            <Group grow>
              <Checkbox
                mt='md'
                label='Suggested as Coach'
                {...form.getInputProps('assessment.suggestedAsCoach', {
                  type: 'checkbox',
                })}
              />
              <Checkbox
                mt='md'
                label='Suggested as Tutor'
                {...form.getInputProps('assessment.suggestedAsTutor', {
                  type: 'checkbox',
                })}
              />
              <Checkbox
                mt='md'
                label='Blocked by PM'
                {...form.getInputProps('assessment.blockedByPM', {
                  type: 'checkbox',
                })}
              />
            </Group>
            {form.values.assessment?.blockedByPM && (
              <Textarea
                autosize
                label='Reason for Blocked by PM'
                placeholder='Reason for blocked by PM'
                minRows={5}
                {...form.getInputProps('assessment.reasonForBlockedByPM')}
              />
            )}
            <TextInput
              withAsterisk
              type='number'
              label='Assessment Score'
              placeholder='Assessment Score'
              {...form.getInputProps('assessment.assessmentScore')}
            />
            <Group grow style={{ alignItems: 'center' }}>
              <Checkbox
                mt='md'
                label='Accepted for the Course'
                {...form.getInputProps('assessment.accepted', {
                  type: 'checkbox',
                })}
              />
              <Checkbox
                mt='md'
                label='Student Application Assessed'
                {...form.getInputProps('assessment.assessed', {
                  type: 'checkbox',
                })}
              />
            </Group>
            <Divider />
            <div style={{ display: 'flex', flexDirection: 'column', gap: '2vh' }}>
              <Text fz='sm' weight={500}>
                Additional Notes
              </Text>
              {form.values.assessment?.instructorComments.map((comment) => (
                <div key={`${comment.id ?? ''} ${comment.timestamp ?? ''}`}>
                  <StudentApplicationComment instructorComment={comment} />
                </div>
              ))}
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
                  if (note && note.length !== 0 && form.values.assessment) {
                    form.setValues({
                      ...form.values,
                      assessment: {
                        ...form.values.assessment,
                        instructorComments: [
                          ...form.values.assessment.instructorComments,
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
      </form>
    </>
  )
}
