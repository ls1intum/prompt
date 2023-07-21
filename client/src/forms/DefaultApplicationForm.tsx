import {
  Checkbox,
  Group,
  Image,
  MultiSelect,
  Select,
  Text,
  Textarea,
  TextInput,
  Title,
} from '@mantine/core'
import { type UseFormReturnType } from '@mantine/form'
import LS1Logo from '../static/ls1logo.png'
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

export enum ApplicationFormAccessMode {
  INSTRUCTOR,
  STUDENT,
}

interface DefaultApplicationFormProps {
  title: string
  accessMode: ApplicationFormAccessMode
  form: UseFormReturnType<
    Partial<Application>,
    (values: Partial<Application>) => Partial<Application>
  >
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
  form,
}: DefaultApplicationFormProps): JSX.Element => {
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
            onWheel={(e) => {
              e.currentTarget.blur()
            }}
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
        <div>
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
          {!form.errors.motivation && (
            <Text fz='xs' ta='right'>{`${form.values.motivation?.length ?? 0} / 500`}</Text>
          )}
        </div>
        <div>
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
          {!form.errors.experience && (
            <Text fz='xs' ta='right'>{`${form.values.experience?.length ?? 0} / 500`}</Text>
          )}
        </div>
      </form>
    </>
  )
}
