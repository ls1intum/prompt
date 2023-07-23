import { isEmail, isNotEmpty, useForm } from '@mantine/form'
import { Dropzone, PDF_MIME_TYPE } from '@mantine/dropzone'
import countries from 'i18n-iso-countries'
import enLocale from 'i18n-iso-countries/langs/en.json'
import {
  TopicArea,
  type ThesisApplication,
} from '../redux/thesisApplicationsSlice/thesisApplicationsSlice'
import {
  Checkbox,
  Group,
  MultiSelect,
  Select,
  Spoiler,
  Stack,
  Text,
  TextInput,
  Textarea,
  rem,
  useMantineTheme,
} from '@mantine/core'
import { Gender, StudyDegree, StudyProgram } from '../redux/applicationsSlice/applicationsSlice'
import { ApplicationFormAccessMode } from './DefaultApplicationForm'
import { DeclarationOfDataConsent } from './DeclarationOfDataConsent'
import { IconPhoto, IconUpload, IconX } from '@tabler/icons-react'

countries.registerLocale(enLocale)
const countriesArr = Object.entries(countries.getNames('en', { select: 'official' })).map(
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
  const form = useForm<ThesisApplication>({
    initialValues: application
      ? {
          ...application,
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
          start: '',
          thesisTitle: '',
          specialSkills: '',
          topicAreas: [],
          motivation: '',
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
      studyDegree: isNotEmpty('Please state your study degree.'),
      studyProgram: isNotEmpty('Please state your study program.'),
      currentSemester: (value) => {
        return !value || value.length === 0 || !/\b([1-9]|[1-9][0-9])\b/.test(value)
          ? 'Please state your current semester.'
          : null
      },
      thesisTitle: (value) => {
        if (!value || !isNotEmpty(value)) {
          return 'Please provide a suggestion for the Theses title.'
        } else if (value.length > 500) {
          return 'The maximum allowed number of characters is 500.'
        }
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
  return (
    <>
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
        </Group>
        <Group>
          <MultiSelect
            disabled={accessMode === ApplicationFormAccessMode.INSTRUCTOR}
            data={Object.keys(TopicArea).map((key) => {
              return {
                label: TopicArea[key as keyof typeof TopicArea],
                value: key,
              }
            })}
            label='Topic Areas'
            placeholder='Topic Areas'
            {...form.getInputProps('topicAreas')}
          />
        </Group>
        <Dropzone
          onDrop={(files) => {
            console.log('accepted files', files)
          }}
          onReject={(files) => {
            console.log('rejected files', files)
          }}
          maxSize={3 * 1024 ** 2}
          accept={PDF_MIME_TYPE}
        >
          <Group
            position='center'
            spacing='xl'
            style={{ minHeight: rem(220), pointerEvents: 'none' }}
          >
            <Dropzone.Accept>
              <IconUpload
                size='3.2rem'
                stroke={1.5}
                color={theme.colors[theme.primaryColor][theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Accept>
            <Dropzone.Reject>
              <IconX
                size='3.2rem'
                stroke={1.5}
                color={theme.colors.red[theme.colorScheme === 'dark' ? 4 : 6]}
              />
            </Dropzone.Reject>
            <Dropzone.Idle>
              <IconPhoto size='3.2rem' stroke={1.5} />
            </Dropzone.Idle>

            <div>
              <Text size='xl' inline>
                Drag images here or click to select files
              </Text>
              <Text size='sm' color='dimmed' inline mt={7}>
                Attach as many files as you like, each file should not exceed 5mb
              </Text>
            </div>
          </Group>
        </Dropzone>
      </form>
      <Stack>
        <Checkbox
          mt='md'
          label='I have read the declaration of consent below and agree to the processing of my data.'
          {...consentForm.getInputProps('declarationOfConsentAccepted', { type: 'checkbox' })}
        />
        <Spoiler
          maxHeight={0}
          showLabel={<Text fz='sm'>Show Declaration of Consent</Text>}
          hideLabel={<Text fz='sm'>Hide</Text>}
        >
          <DeclarationOfDataConsent />
        </Spoiler>
      </Stack>
    </>
  )
}
