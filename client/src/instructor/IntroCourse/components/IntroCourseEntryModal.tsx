import {
  ActionIcon,
  Badge,
  Button,
  Center,
  Checkbox,
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
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../redux/store'
import { isNotEmpty, useForm } from '@mantine/form'
import { type IntroCourseParticipation } from '../../../redux/introCourseSlice/introCourseSlice'
import { type Student } from '../../../redux/applicationsSlice/applicationsSlice'
import { type Patch } from '../../../service/configService'
import { updateIntroCourseParticipation } from '../../../redux/introCourseSlice/thunks/updateIntroCourseParticipation'
import {
  SkillProficiency,
  getBadgeColor,
} from '../../../redux/studentPostKickoffSubmissionsSlice/studentPostKickoffSubmissionsSlice'
import { IconCalendar, IconPlus, IconTrash } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import moment from 'moment'
import { DeletionConfirmationModal } from '../../../utilities/DeletionConfirmationModal'
import { deleteIntroCourseAbsence } from '../../../redux/introCourseSlice/thunks/deleteIntroCourseAbsence'
import { createIntroCourseAbsence } from '../../../redux/introCourseSlice/thunks/createIntroCourseAbsence'
import { DatePickerInput } from '@mantine/dates'
import { markNotPassed } from '../../../redux/introCourseSlice/thunks/markNotPassed'
import { markPassed } from '../../../redux/introCourseSlice/thunks/markPassed'
import {
  markDroppedOut,
  unmarkDroppedOut,
} from '../../../redux/introCourseSlice/thunks/markAsDroppedOut'

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
  const dispatch = useDispatch<AppDispatch>()
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
    })
  }, [introCourseParticipation])

  const close = (): void => {
    introCourseParticipationForm.reset()
    introCourseAssessmentForm.reset()
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
      <Stack>
        <Select
          label='Assigned Tutor'
          placeholder='Assigned tutor'
          disabled={isTutor}
          withinPortal
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
        <Group position='right'>
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

              void dispatch(
                updateIntroCourseParticipation({
                  introCourseParticipationId: introCourseParticipation.id,
                  introCourseParticipationPatch: introCourseParticipationPatchObjectArray,
                }),
              )

              close()
            }}
          >
            Save
          </Button>
        </Group>
        <Divider label={<Text c='dimmed'>Proficiency</Text>} labelPosition='center' />
        <Select
          label='Proficiency Level'
          itemComponent={SelectItemProficiencyLevel}
          searchable
          data={Object.keys(SkillProficiency).map((key) => {
            return {
              label: key,
              value: key,
            }
          })}
          {...introCourseParticipationForm.getInputProps('supervisorAssessment')}
          nothingFound='Nothing found'
          filter={(value, item) =>
            item.label?.toLowerCase().includes(value.toLowerCase().trim()) ??
            item.value?.toLowerCase().includes(value.toLowerCase().trim())
          }
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
        <Group position='right'>
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
              void dispatch(
                updateIntroCourseParticipation({
                  introCourseParticipationId: introCourseParticipation.id,
                  introCourseParticipationPatch: patchObject,
                }),
              )
            }}
          >
            Save
          </Button>
        </Group>
        <Divider label={<Text c='dimmed'>Intro Course Absences</Text>} labelPosition='center' />
        <Group position='right'>
          <Button
            leftIcon={<IconPlus />}
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
                render: ({ date }) => (
                  <Text>{`${moment(date).format('dddd, DD. MMMM YYYY')}`}</Text>
                ),
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
            introCourseAssessmentForm.setValues({ droppedOut: event.currentTarget.checked })
          }}
        />
        <Group position='right'>
          <Button
            onClick={() => {
              if (introCourseAssessmentForm.values.passed) {
                void dispatch(markPassed(introCourseParticipation.id))
              } else if (introCourseAssessmentForm.values.passed === false) {
                void dispatch(markNotPassed(introCourseParticipation.id))
              }
              if (introCourseAssessmentForm.values.droppedOut) {
                void dispatch(markDroppedOut(introCourseParticipation.id))
              } else {
                void dispatch(unmarkDroppedOut(introCourseParticipation.id))
              }
              onClose()
            }}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}
