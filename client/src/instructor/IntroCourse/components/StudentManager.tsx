import {
  Accordion,
  ActionIcon,
  Badge,
  Button,
  Card,
  Center,
  Collapse,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
  Transition,
  UnstyledButton,
} from '@mantine/core'
import { type AppDispatch, useAppSelector } from '../../../redux/store'
import {
  IconCalendar,
  IconMessage,
  IconPlus,
  IconRocket,
  IconSearch,
  IconSend,
  IconStarFilled,
  IconTrash,
} from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { type IntroCourseParticipation } from '../../../redux/introCourseSlice/introCourseSlice'
import { isNotEmpty, useForm } from '@mantine/form'
import { DatePickerInput } from '@mantine/dates'
import { useDispatch } from 'react-redux'
import { createIntroCourseAbsence } from '../../../redux/introCourseSlice/thunks/createIntroCourseAbsence'
import { DataTable } from 'mantine-datatable'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import moment from 'moment'
import { DeletionConfirmationModal } from '../../../utilities/DeletionConfirmationModal'
import { deleteIntroCourseAbsence } from '../../../redux/introCourseSlice/thunks/deleteIntroCourseAbsence'
import { SkillProficiency } from '../../../redux/studentPostKickoffSubmissionsSlice/studentPostKickoffSubmissionsSlice'
import { updateIntroCourseParticipation } from '../../../redux/introCourseSlice/thunks/updateIntroCourseParticipation'
import { markPassed } from '../../../redux/introCourseSlice/thunks/markPassed'
import { markNotPassed } from '../../../redux/introCourseSlice/thunks/markNotPassed'

const getBadgeColor = (skillProfieciency: keyof typeof SkillProficiency): string => {
  switch (skillProfieciency) {
    case 'NOVICE':
      return 'yellow'
    case 'INTERMEDIATE':
      return 'orange'
    case 'ADVANCED':
      return 'teal'
    case 'EXPERT':
      return 'green'
  }
  return 'gray'
}

interface IntroCourseAbsenceCreationModalProps {
  introCourseParticipationId: string
  opened: boolean
  onClose: () => void
}

const IntroCourseAbsenceCreationModal = ({
  introCourseParticipationId,
  opened,
  onClose,
}: IntroCourseAbsenceCreationModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const introCourseAbsenceForm = useForm({
    initialValues: {
      id: '',
      date: new Date(),
      excuse: '',
    },
    validate: {
      date: isNotEmpty('Please select a date'),
    },
  })

  const close = (): void => {
    introCourseAbsenceForm.reset()
    onClose()
  }

  return (
    <Modal centered size='90%' opened={opened} onClose={close}>
      <Stack style={{ padding: '20vh 0' }}>
        <DatePickerInput
          icon={<IconCalendar />}
          label='Date'
          {...introCourseAbsenceForm.getInputProps('date')}
        />
        <TextInput
          label='Excuse'
          placeholder='Excuse'
          {...introCourseAbsenceForm.getInputProps('excuse')}
        />
        <Button
          disabled={!introCourseAbsenceForm.isValid()}
          onClick={() => {
            void dispatch(
              createIntroCourseAbsence({
                introCourseParticipationId,
                introCourseAbsence: introCourseAbsenceForm.values,
              }),
            )
            close()
          }}
        >
          Save
        </Button>
      </Stack>
    </Modal>
  )
}

interface IntroCourseChallengeResultModalProps {
  introCourseParticipation: IntroCourseParticipation
  opened: boolean
  onClose: () => void
}

const IntroCourseChallengeResultModal = ({
  opened,
  onClose,
  introCourseParticipation,
}: IntroCourseChallengeResultModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()

  return (
    <Modal centered opened={opened} onClose={onClose}>
      <Stack>
        <Text>Did the student pass the Intro Course Challenge?</Text>
        <Group position='right'>
          <Button
            onClick={() => {
              void dispatch(markNotPassed(introCourseParticipation.id))
              onClose()
            }}
          >
            No
          </Button>
          <Button
            onClick={() => {
              void dispatch(markPassed(introCourseParticipation.id))
              onClose()
            }}
          >
            Yes
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

interface StudentEntryProps {
  introCourseParticipation: IntroCourseParticipation
}

const StudentEntry = ({ introCourseParticipation }: StudentEntryProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
  const [absenceCreationModalOpened, setAbsenceCreationModalOpened] = useState(false)
  const [selectedIntroCourseAbsenceToDelete, setSelectedIntroCourseAbsenceToDelete] =
    useState<string>()
  const [introCourseChallengeResultModalOpened, setIntroCourseChallengeResultModalOpened] =
    useState(false)
  const [supervisorAssessmentMounted, setSupervisorAssessmentMounted] = useState(false)
  const [supervisorCommentOpened, setSupervisorCommentOpened] = useState(false)
  const form = useForm({
    initialValues: {
      tutorComments: introCourseParticipation.tutorComments ?? '',
    },
    validateInputOnBlur: true,
    validateInputOnChange: true,
    validate: {
      tutorComments: (value) =>
        value.length > 500 ? 'The comment should not exceed 500 characters.' : null,
    },
  })

  useEffect(() => {
    form.setValues({ tutorComments: introCourseParticipation.tutorComments ?? '' })
  }, [introCourseParticipation.supervisorAssessment])

  return (
    <Stack>
      <IntroCourseAbsenceCreationModal
        introCourseParticipationId={introCourseParticipation.id}
        opened={absenceCreationModalOpened}
        onClose={() => {
          setAbsenceCreationModalOpened(false)
        }}
      />
      <IntroCourseChallengeResultModal
        opened={introCourseChallengeResultModalOpened}
        onClose={() => {
          setIntroCourseChallengeResultModalOpened(false)
        }}
        introCourseParticipation={introCourseParticipation}
      />
      <DeletionConfirmationModal
        title='Delete Intro Course Absence'
        text={`Are you sure you want to delete this absence for student ${
          introCourseParticipation.student.firstName ?? ''
        } ${introCourseParticipation.student.lastName ?? ''} for the day ${moment(
          introCourseParticipation.absences
            .filter((absence) => absence.id === selectedIntroCourseAbsenceToDelete)
            .at(0)?.date ?? new Date(),
        ).format('dddd, DD. MMMM YYYY')}?`}
        opened={!!selectedIntroCourseAbsenceToDelete}
        onClose={() => {
          setSelectedIntroCourseAbsenceToDelete(undefined)
        }}
        onConfirm={() => {
          if (selectedIntroCourseAbsenceToDelete) {
            void dispatch(
              deleteIntroCourseAbsence({
                introCourseParticipationId: introCourseParticipation.id,
                introCourseAbsenceId: selectedIntroCourseAbsenceToDelete,
              }),
            )
          }
          setSelectedIntroCourseAbsenceToDelete(undefined)
        }}
      />
      <Group position='right'>
        {Object.keys(SkillProficiency).map((key) => (
          <Transition
            mounted={supervisorAssessmentMounted}
            transition='slide-right'
            duration={500}
            timingFunction='ease'
            key={key}
          >
            {(styles) => (
              <UnstyledButton
                style={styles}
                onClick={() => {
                  void dispatch(
                    updateIntroCourseParticipation({
                      introCourseParticipationId: introCourseParticipation.id,
                      introCourseParticipationPatch: [
                        {
                          op: 'replace',
                          path: '/supervisorAssessment',
                          value: key as keyof typeof SkillProficiency,
                        },
                      ],
                    }),
                  )
                }}
              >
                <Badge color={getBadgeColor(key as keyof typeof SkillProficiency)}>{key}</Badge>
              </UnstyledButton>
            )}
          </Transition>
        ))}
        <Button
          leftIcon={<IconRocket />}
          onClick={() => {
            setSupervisorAssessmentMounted(!supervisorAssessmentMounted)
          }}
        >
          Add Skill Proficiency
        </Button>
        <Button
          leftIcon={<IconMessage />}
          onClick={() => {
            setSupervisorCommentOpened(!supervisorCommentOpened)
          }}
        >
          Add Comment
        </Button>
        <Button
          leftIcon={<IconPlus />}
          onClick={() => {
            setAbsenceCreationModalOpened(true)
          }}
        >
          Log Absence
        </Button>
        <Button
          leftIcon={<IconStarFilled />}
          onClick={() => {
            setIntroCourseChallengeResultModalOpened(true)
          }}
        >
          Set Intro Course Challenge Result
        </Button>
      </Group>
      <Collapse in={supervisorCommentOpened}>
        <Group position='right'>
          <div style={{ width: '70%' }}>
            <Textarea
              label='Comment'
              placeholder='Comment'
              autosize
              minRows={5}
              {...form.getInputProps('tutorComments')}
            />
            {!form.errors.tutorComments && (
              <Text fz='xs' ta='right'>{`${form.values.tutorComments?.length ?? 0} / 500`}</Text>
            )}
          </div>
          <Button
            leftIcon={<IconSend />}
            disabled={!form.isValid()}
            onClick={() => {
              if (form.values.tutorComments) {
                void dispatch(
                  updateIntroCourseParticipation({
                    introCourseParticipationId: introCourseParticipation.id,
                    introCourseParticipationPatch: [
                      {
                        op: 'replace',
                        path: '/tutorComments',
                        value: form.values.tutorComments,
                      },
                    ],
                  }),
                )
                setSupervisorCommentOpened(false)
              }
            }}
          >
            Send
          </Button>
        </Group>
      </Collapse>
      {introCourseParticipation.tutorComments && (
        <Card withBorder>
          <Text fz='sm' c='dimmed'>
            {introCourseParticipation.tutorComments}
          </Text>
        </Card>
      )}
      {introCourseParticipation.absences.length === 0 ? (
        <Center>
          <Text c='dimmed' fw={500}>
            No absences logged.
          </Text>
        </Center>
      ) : (
        <DataTable
          withBorder
          noRecordsText='No records to show'
          borderRadius='sm'
          withColumnBorders
          verticalSpacing='sm'
          striped
          records={introCourseParticipation.absences}
          bodyRef={bodyRef}
          columns={[
            {
              accessor: 'date',
              title: 'Date',
              textAlignment: 'center',
              render: ({ date }) => <Text>{`${moment(date).format('dddd, DD. MMMM YYYY')}`}</Text>,
            },
            {
              accessor: 'excuse',
              title: 'Excuse',
              textAlignment: 'center',
            },
            {
              accessor: 'actions',
              title: 'Actions',
              render: (absence) => (
                <Group spacing={4} position='right' noWrap>
                  <ActionIcon
                    color='red'
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      setSelectedIntroCourseAbsenceToDelete(absence.id)
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
        />
      )}
    </Stack>
  )
}

export const StudentManager = (): JSX.Element => {
  const introCourseParticipations = useAppSelector((state) => state.introCourse.participations)
  const [searchQuery, setSearchQuery] = useState('')
  const [students, setStudents] = useState(introCourseParticipations)
  const tutors = useAppSelector((state) => state.introCourse.tutors)
  const [selectedTutor, setSelectedTutor] = useState<string | null>()

  useEffect(() => {
    setStudents(
      introCourseParticipations
        .filter((participation) => {
          if (!selectedTutor) {
            return true
          }
          return participation.tutorId === selectedTutor
        })
        .filter((participation) => {
          return `${participation.student.firstName ?? ''} ${participation.student.lastName ?? ''}`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        }),
    )
  }, [introCourseParticipations, searchQuery, selectedTutor])

  return (
    <>
      <Group>
        <TextInput
          sx={{ flexBasis: '60%', margin: '1vh 0' }}
          placeholder='Search students...'
          icon={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.currentTarget.value)
          }}
        />
        <Select
          data={tutors.map((tutor) => {
            return {
              label: `${tutor.firstName ?? ''} ${tutor.lastName ?? ''}`,
              value: tutor.id,
            }
          })}
          value={selectedTutor}
          placeholder='Tutor'
          onChange={(value) => {
            setSelectedTutor(value)
          }}
          icon={<IconSearch size={16} />}
          clearable
          searchable
        />
      </Group>
      <Accordion
        onChange={(value) => {
          if (value) {
            setSearchQuery(value)
          } else {
            setSearchQuery('')
          }
        }}
      >
        {[...students]
          .sort((a, b) =>
            `${a.student.firstName ?? ''} ${a.student.lastName ?? ''}`.localeCompare(
              `${b.student.firstName ?? ''} ${b.student.lastName ?? ''}`,
            ),
          )
          .map((participation) => (
            <Accordion.Item
              key={participation.id}
              value={`${participation.student.firstName ?? ''} ${
                participation.student.lastName ?? ''
              }`}
            >
              <Accordion.Control>
                <Group position='apart'>
                  <Group position='left'>
                    <Text>{`${participation.student.firstName ?? ''} ${
                      participation.student.lastName ?? ''
                    }`}</Text>
                    {participation.passed !== null &&
                      (participation.passed ? (
                        <Badge color='green' variant='outline'>
                          PASSED
                        </Badge>
                      ) : (
                        <Badge color='red' variant='outline'>
                          NOT PASSED
                        </Badge>
                      ))}
                  </Group>
                  {participation.supervisorAssessment && (
                    <Badge color={getBadgeColor(participation.supervisorAssessment)}>
                      {participation.supervisorAssessment}
                    </Badge>
                  )}
                </Group>
              </Accordion.Control>
              <Accordion.Panel>
                {<StudentEntry introCourseParticipation={participation} />}
              </Accordion.Panel>
            </Accordion.Item>
          ))}
      </Accordion>
    </>
  )
}
