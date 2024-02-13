import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Checkbox,
  type ComboboxItem,
  Divider,
  Group,
  Modal,
  Select,
  Stack,
  Text,
  TextInput,
  Textarea,
} from '@mantine/core'
import { forwardRef, useEffect, useState } from 'react'
import { isNotEmpty, useForm } from '@mantine/form'
import { type Student } from '../../../interface/application'
import { type Patch } from '../../../network/configService'
import { IconCalendar, IconPlus, IconTrash } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import moment from 'moment'
import { ConfirmationModal } from '../../../utilities/ConfirmationModal'
import { DatePickerInput } from '@mantine/dates'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  deleteIntroCourseAbsence,
  deleteIntroCourseDropOut,
  patchIntroCourseParticipation,
  postIntroCourseAbsence,
  postIntroCourseDropOut,
  postNotPassedIntroCourseParticipation,
  postPassedIntroCourseParticipation,
} from '../../../network/introCourse'
import { Query } from '../../../state/query'
import { IntroCourseParticipation } from '../../../interface/introCourse'
import { SkillProficiency } from '../../../interface/postKickOffSubmission'

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

interface ItemProps extends React.ComponentPropsWithoutRef<'div'> {
  label: string
}

const SelectItemProficiencyLevel = forwardRef<HTMLDivElement, ItemProps>(
  ({ label, ...others }: ItemProps, ref) => (
    <div ref={ref} {...others}>
      <Badge color={getBadgeColor(label as keyof typeof SkillProficiency)}>{label}</Badge>
    </div>
  ),
)

SelectItemProficiencyLevel.displayName = 'SelectItemProficiencyLevel'

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
  const queryClient = useQueryClient()
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

  const createIntroCourseAbsence = useMutation({
    mutationFn: () =>
      postIntroCourseAbsence(introCourseParticipationId, introCourseAbsenceForm.values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE] })
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
          leftSection={<IconCalendar />}
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
            createIntroCourseAbsence.mutate()
            close()
          }}
        >
          Save
        </Button>
      </Stack>
    </Modal>
  )
}

interface IntroCourseEntryModalProps {
  opened: boolean
  onClose: () => void
  introCourseParticipation: IntroCourseParticipation
  tutors: Student[]
  isTutor: boolean
}

export const IntroCourseEntryModal = ({
  opened,
  onClose,
  introCourseParticipation,
  tutors,
  isTutor,
}: IntroCourseEntryModalProps): JSX.Element => {
  const queryClient = useQueryClient()
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
  const introCourseParticipationForm = useForm({
    initialValues: {
      tutorId: introCourseParticipation.tutorId ?? '',
      seat: introCourseParticipation.seat ?? '',
      chairDevice: introCourseParticipation.chairDevice ?? '',
      supervisorAssessment: introCourseParticipation.supervisorAssessment ?? null,
      tutorComments: introCourseParticipation.tutorComments ?? '',
    },
  })
  const [selectedIntroCourseAbsenceToDelete, setSelectedIntroCourseAbsenceToDelete] =
    useState<string>()
  const [absenceCreationModalOpened, setAbsenceCreationModalOpened] = useState(false)
  const introCourseAssessmentForm = useForm({
    initialValues: {
      passed: introCourseParticipation.passed,
      droppedOut: introCourseParticipation.droppedOut ?? false,
    },
  })

  const updateIntroCourseParticipation = useMutation({
    mutationFn: (introCourseParticipationPatch: Patch[]) =>
      patchIntroCourseParticipation(introCourseParticipation.id, introCourseParticipationPatch),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE] })
    },
  })

  const removeIntroCourseAbsence = useMutation({
    mutationFn: () =>
      deleteIntroCourseAbsence(
        introCourseParticipation.id,
        selectedIntroCourseAbsenceToDelete ?? '',
      ),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE] })
    },
  })

  const markDroppedOut = useMutation({
    mutationFn: () => postIntroCourseDropOut(introCourseParticipation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE] })
    },
  })

  const unmarkDroppedOut = useMutation({
    mutationFn: () => deleteIntroCourseDropOut(introCourseParticipation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE] })
    },
  })

  const markPassed = useMutation({
    mutationFn: () => postPassedIntroCourseParticipation(introCourseParticipation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE] })
    },
  })

  const markNotPassed = useMutation({
    mutationFn: () => postNotPassedIntroCourseParticipation(introCourseParticipation.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE] })
    },
  })

  useEffect(() => {
    introCourseAssessmentForm.setValues({
      passed: introCourseParticipation.passed,
      droppedOut: introCourseParticipation.droppedOut,
    })
    introCourseParticipationForm.setValues({
      tutorId: introCourseParticipation.tutorId ?? '',
      seat: introCourseParticipation.seat ?? '',
      chairDevice: introCourseParticipation.chairDevice ?? '',
      supervisorAssessment: introCourseParticipation.supervisorAssessment ?? null,
      tutorComments: introCourseParticipation.tutorComments ?? '',
    })
  }, [introCourseAssessmentForm, introCourseParticipation, introCourseParticipationForm])

  const close = (): void => {
    introCourseAssessmentForm.reset()
    introCourseParticipationForm.reset()
    onClose()
  }

  return (
    <Modal
      centered
      size='90%'
      opened={opened}
      onClose={close}
      title={
        <Text c='dimmed' fw={500}>{`${introCourseParticipation.student.firstName ?? ''} ${
          introCourseParticipation.student.lastName ?? ''
        }`}</Text>
      }
    >
      <IntroCourseAbsenceCreationModal
        introCourseParticipationId={introCourseParticipation.id}
        opened={absenceCreationModalOpened}
        onClose={() => {
          setAbsenceCreationModalOpened(false)
        }}
      />
      <ConfirmationModal
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
            removeIntroCourseAbsence.mutate()
          }
          setSelectedIntroCourseAbsenceToDelete(undefined)
        }}
      />
      <Stack>
        <Select
          label='Assigned Tutor'
          placeholder='Assigned tutor'
          disabled={isTutor}
          comboboxProps={{ withinPortal: true }}
          data={tutors.map((tutor) => {
            return {
              label: `${tutor.firstName ?? ''} ${tutor.lastName ?? ''}`,
              value: tutor.id,
            }
          })}
          {...introCourseParticipationForm.getInputProps('tutorId')}
        />
        <TextInput
          label='Seat'
          placeholder='Seat'
          {...introCourseParticipationForm.getInputProps('seat')}
        />
        <TextInput
          label='Chair Device'
          placeholder='Chair device ID'
          {...introCourseParticipationForm.getInputProps('chairDevice')}
        />
        <Group align='right'>
          <Button
            onClick={() => {
              const introCourseParticipationPatchObjectArray: Patch[] = []
              Object.keys(introCourseParticipationForm.values).forEach((key) => {
                if (introCourseParticipationForm.isDirty(key)) {
                  const introCoursePrticipationPatchObject = new Map()
                  introCoursePrticipationPatchObject.set('op', 'replace')
                  introCoursePrticipationPatchObject.set('path', '/' + key)
                  introCoursePrticipationPatchObject.set(
                    'value',
                    introCourseParticipationForm.getInputProps(key).value,
                  )
                  const obj = Object.fromEntries(introCoursePrticipationPatchObject)
                  introCourseParticipationPatchObjectArray.push(obj)
                }
              })

              updateIntroCourseParticipation.mutate(introCourseParticipationPatchObjectArray)

              close()
            }}
          >
            Save
          </Button>
        </Group>
        <Divider label={<Text c='dimmed'>Proficiency</Text>} labelPosition='center' />
        <Select
          label='Proficiency Level'
          searchable
          data={Object.keys(SkillProficiency).map((key) => {
            return {
              label: key,
              value: key,
            }
          })}
          {...introCourseParticipationForm.getInputProps('supervisorAssessment')}
          nothingFoundMessage='Nothing found'
          filter={({ options, search }) => {
            const filtered = (options as ComboboxItem[]).filter((option) =>
              option.label.toLowerCase().trim().includes(search.toLowerCase().trim()),
            )

            filtered.sort((a, b) => a.label.localeCompare(b.label))
            return filtered
          }}
        />
        <Textarea
          label='Comment'
          placeholder='Comment'
          autosize
          minRows={5}
          {...introCourseParticipationForm.getInputProps('tutorComments')}
        />
        {!introCourseParticipationForm.errors.tutorComments && (
          <Text fz='xs' ta='right'>{`${
            introCourseParticipationForm.values.tutorComments?.length ?? 0
          } / 500`}</Text>
        )}
        <Group align='right'>
          <Button
            onClick={() => {
              let patchObject: Patch[] = [
                {
                  op: 'replace',
                  path: '/tutorComments',
                  value: introCourseParticipationForm.values.tutorComments,
                },
              ]
              if (introCourseParticipationForm.values.supervisorAssessment) {
                patchObject = [
                  ...patchObject,
                  {
                    op: 'replace',
                    path: '/supervisorAssessment',
                    value: introCourseParticipationForm.values.supervisorAssessment,
                  },
                ]
              }
              updateIntroCourseParticipation.mutate(patchObject)
            }}
          >
            Save
          </Button>
        </Group>
        <Divider label={<Text c='dimmed'>Intro Course Absences</Text>} labelPosition='center' />
        <Group align='right'>
          <Button
            leftSection={<IconPlus />}
            onClick={() => {
              setAbsenceCreationModalOpened(true)
            }}
          >
            Log Absence
          </Button>
        </Group>
        {introCourseParticipation.absences.length === 0 ? (
          <Center>
            <Text c='dimmed' fw={500}>
              No absences logged.
            </Text>
          </Center>
        ) : (
          <DataTable
            withTableBorder
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
                textAlign: 'center',
                render: ({ date }) => (
                  <Text>{`${moment(date).format('dddd, DD. MMMM YYYY')}`}</Text>
                ),
              },
              {
                accessor: 'excuse',
                title: 'Excuse',
                textAlign: 'center',
              },
              {
                accessor: 'actions',
                title: 'Actions',
                render: (absence) => (
                  <Group gap={4} align='right' wrap='nowrap'>
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
        <Divider label={<Text c='dimmed'>Intro Course Assessment</Text>} labelPosition='center' />
        <Select
          label='Assessment'
          data={['Passed', 'Not Passed']}
          value={
            introCourseAssessmentForm.values.passed
              ? 'Passed'
              : introCourseAssessmentForm.values.passed === false
              ? 'Not Passed'
              : null
          }
          onChange={(value) => {
            if (value === 'Passed') {
              introCourseAssessmentForm.setValues({
                passed: true,
              })
            }
            if (value === 'Not Passed') {
              introCourseAssessmentForm.setValues({
                passed: false,
              })
            }
            if (value === null) {
              introCourseAssessmentForm.setValues({
                passed: undefined,
              })
            }
          }}
          clearable
        />
        <Checkbox
          label='Dropped out?'
          checked={introCourseAssessmentForm.values.droppedOut}
          onChange={(event) => {
            introCourseAssessmentForm.setValues({
              droppedOut: event.currentTarget.checked,
            })
          }}
        />
        <Group align='right'>
          <Button
            onClick={() => {
              if (introCourseAssessmentForm.values.passed) {
                markPassed.mutate()
              } else if (introCourseAssessmentForm.values.passed === false) {
                markNotPassed.mutate()
              }
              if (introCourseAssessmentForm.values.droppedOut) {
                markDroppedOut.mutate()
              } else {
                unmarkDroppedOut.mutate()
              }
              close()
            }}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
