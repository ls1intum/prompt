import { DataTable } from 'mantine-datatable'
import { type AppDispatch, useAppSelector } from '../../../redux/store'
import { CSVLink } from 'react-csv'
import { useEffect, useRef, useState } from 'react'
import {
  type SeatPlanAssignment,
  type IntroCourseParticipation,
  type Seat,
} from '../../../redux/introCourseSlice/introCourseSlice'
import {
  Group,
  Tooltip,
  ActionIcon,
  Text,
  Stack,
  TextInput,
  Modal,
  Select,
  Button,
  MultiSelect,
  FileInput,
  Table,
  Stepper,
  Card,
  Checkbox,
  Collapse,
} from '@mantine/core'
import {
  IconDeviceLaptop,
  IconDownload,
  IconEdit,
  IconMail,
  IconSearch,
  IconUpload,
} from '@tabler/icons-react'
import Daddy from 'papaparse'
import { type Student } from '../../../redux/applicationsSlice/applicationsSlice'
import { isNotEmpty, useForm } from '@mantine/form'
import { useDispatch } from 'react-redux'
import { type Patch } from '../../../service/configService'
import { updateIntroCourseParticipation } from '../../../redux/introCourseSlice/thunks/updateIntroCourseParticipation'
import { notifications } from '@mantine/notifications'
import { createSeatPlanAssignments } from '../../../redux/introCourseSlice/thunks/createSeatPlanAssignments'
import { createSeatPlan } from '../../../redux/introCourseSlice/thunks/createSeatPlan'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import type Keycloak from 'keycloak-js'
import { sendInvitationsForStudentTechnicalDetailsSubmission } from '../../../service/introCourseService'

interface SeatPlanUploadModalProps {
  opened: boolean
  onClose: () => void
  introCourseParticipations: IntroCourseParticipation[]
  tutors: Student[]
}

const SeatPlanUploadModal = ({
  opened,
  onClose,
  introCourseParticipations,
  tutors,
}: SeatPlanUploadModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const [stepperActiveStep, setStepperActiveStep] = useState(0)
  const [uploadMode, setUploadMode] = useState('full')
  const [columnNames, setColumnNames] = useState<string[]>([])
  const [upload, setUpload] = useState<object[]>()
  const joinColumns = useForm({
    initialValues: {
      studentJoinColumnFromTable: '',
      studentJoinColumnFromUpload: '',
      seatJoinColumn: '',
      withChairDeviceJoinColumn: '',
      tutorJoinColumnFromTable: '',
      tutorJoinColumnFromUpload: '',
      withTutorAssignment: false,
    },
    validateInputOnBlur: true,
    validate: {
      studentJoinColumnFromTable: (value) =>
        isNotEmpty(value) || uploadMode === 'plain' ? null : 'Please select a column',
      studentJoinColumnFromUpload: (value) =>
        isNotEmpty(value) || uploadMode === 'plain' ? null : 'Please select a column',
      seatJoinColumn: isNotEmpty('Please select a column'),
      withChairDeviceJoinColumn: (value) =>
        isNotEmpty(value) || uploadMode === 'full' ? null : 'Please select a column',
      tutorJoinColumnFromTable: (value, values) =>
        isNotEmpty(value) || !values.withTutorAssignment || uploadMode === 'plain'
          ? null
          : 'Please select a column',
      tutorJoinColumnFromUpload: (value, values) =>
        isNotEmpty(value) || !values.withTutorAssignment || uploadMode === 'plain'
          ? null
          : 'Please select a column',
    },
  })

  const close = (): void => {
    setColumnNames([])
    setUpload(undefined)
    onClose()
  }

  return (
    <Modal centered size='90%' opened={opened} onClose={close}>
      <Stepper active={stepperActiveStep} onStepClick={setStepperActiveStep}>
        <Stepper.Step description='Upload Mode'>
          <Group grow style={{ alignItems: 'baseline' }}>
            <Stack>
              <Tooltip label='Seat plan with assignment of students to seat and tutors'>
                <Button
                  onClick={() => {
                    setUploadMode('full')
                    setStepperActiveStep(stepperActiveStep + 1)
                  }}
                >
                  Upload Seat Plan with Assignments
                </Button>
              </Tooltip>
              <Text fz='sm' c='dimmed'>
                Upload a .csv file with seat and tutor assignments to students. An example file
                structure is exemplified below. The column names can be selected arbitrary. However,
                the seat plan needs to provide the required data. The uploaded data will be
                validated against data from the database and in case no breaking inconsistencies are
                detected, the database will be updated with the uploaded data without any further
                processing.
              </Text>
              <Card>
                <Text fz='sm' ta='right' c='dimmed'>
                  seat_plan_full.csv
                </Text>
                <Text fz='sm' c='bold'>
                  tumId,seat,tutor
                </Text>
                <Text fz='sm' c='dimmed'>
                  username_1,A1,username_3
                </Text>
                <Text fz='sm' c='dimmed'>
                  username_2,A2,username_4
                </Text>
              </Card>
            </Stack>
            <Stack>
              <Tooltip label='Seat plan with device availability. The assignment will be conducted on the server with respect to device demand.'>
                <Button
                  onClick={() => {
                    setUploadMode('plain')
                    setStepperActiveStep(stepperActiveStep + 1)
                  }}
                >
                  Upload Seat Plan Only
                </Button>
              </Tooltip>
              <Text fz='sm' c='dimmed'>
                Upload a .csv file with seat plan and device availability for each seat. An example
                file structure is exemplified below. The column names can be selected arbitrary.
                However, the seat plan needs to provide the required data: seat label and, if
                available, device id. The uploaded data will be sent to the server and students will
                be assigned to seats with regard to device demand and availability.
              </Text>
              <Card>
                <Text fz='sm' ta='right' c='dimmed'>
                  seat_plan_plain.csv
                </Text>
                <Text fz='sm' c='bold'>
                  seat,device
                </Text>
                <Text fz='sm' c='dimmed'>
                  A1,984fba9c-2e1f-4f12-9adc-4311faab845d
                </Text>
                <Text fz='sm' c='dimmed'>
                  A2,
                </Text>
              </Card>
            </Stack>
          </Group>
        </Stepper.Step>
        <Stepper.Step description='Upload'>
          <Stack>
            <FileInput
              placeholder={
                uploadMode === 'full'
                  ? 'Upload seat plan with student to seat and tutor assignments'
                  : 'Upload seat plan with device availability'
              }
              accept='.csv'
              icon={<IconUpload />}
              onChange={(file) => {
                if (file) {
                  Daddy.parse(file, {
                    header: true,
                    skipEmptyLines: true,
                    complete: function (results: {
                      meta: {
                        fields: string[]
                      }
                      data: any[]
                      errors: Array<{ message: string; row: number }>
                    }) {
                      if (results.errors?.length > 0) {
                        notifications.show({
                          color: 'red',
                          autoClose: 5000,
                          title: 'Error',
                          message: `Failed to parse .csv due to error: ${results.errors[0].message}`,
                        })
                      }

                      setColumnNames(results.meta.fields ?? [])
                      setUpload(results.data)
                    },
                  })
                }
              }}
            />
            {upload && uploadMode === 'full' && (
              <Stack>
                <Group grow>
                  <Select
                    label='Student Join Column From Table'
                    data={['tumId', 'matriculationNumber']}
                    {...joinColumns.getInputProps('studentJoinColumnFromTable')}
                  />
                  <Select
                    label='Student Join Column From Upload'
                    data={columnNames}
                    {...joinColumns.getInputProps('studentJoinColumnFromUpload')}
                  />
                  <Select
                    label='Seat Join Column'
                    data={columnNames}
                    {...joinColumns.getInputProps('seatJoinColumn')}
                  />
                </Group>
                <Checkbox
                  label='Does the upload contain student to tutor assignments?'
                  {...joinColumns.getInputProps('withTutorAssignment', { type: 'checkbox' })}
                />
                <Collapse in={joinColumns.values.withTutorAssignment}>
                  <Group grow>
                    <Select
                      label='Tutor Join Column From Table'
                      data={['tumId', 'matriculationNumber']}
                      {...joinColumns.getInputProps('tutorJoinColumnFromTable')}
                    />
                    <Select
                      label='Tutor Join Column From Upload'
                      data={columnNames}
                      {...joinColumns.getInputProps('tutorJoinColumnFromUpload')}
                    />
                  </Group>
                </Collapse>
              </Stack>
            )}
            {upload && uploadMode === 'plain' && (
              <Stack>
                <Group grow>
                  <Select
                    label='Seat Join Column'
                    data={columnNames}
                    {...joinColumns.getInputProps('seatJoinColumn')}
                  />
                  <Select
                    label='Device Availability Join Column'
                    data={columnNames}
                    {...joinColumns.getInputProps('withChairDeviceJoinColumn')}
                  />
                </Group>
                <Checkbox
                  label='Does the upload contain student to tutor assignments?'
                  {...joinColumns.getInputProps('withTutorAssignment', { type: 'checkbox' })}
                />
                <Collapse in={joinColumns.values.withTutorAssignment}>
                  <Group grow>
                    <Select
                      label='Tutor Join Column From Table'
                      data={['tumId', 'matriculationNumber']}
                      {...joinColumns.getInputProps('tutorJoinColumnFromTable')}
                    />
                    <Select
                      label='Tutor Join Column From Upload'
                      data={columnNames}
                      {...joinColumns.getInputProps('tutorJoinColumnFromUpload')}
                    />
                  </Group>
                </Collapse>
              </Stack>
            )}
            <Button
              disabled={!upload || !joinColumns.isValid()}
              onClick={() => {
                if (uploadMode === 'full') {
                  const seatPlanAssignments: SeatPlanAssignment[] = []
                  upload?.forEach((element) => {
                    const introCourseParticipation =
                      joinColumns.values.studentJoinColumnFromTable === 'tumId'
                        ? introCourseParticipations.find(
                            (participation) =>
                              participation.student.tumId ===
                              (element as any)[joinColumns.values.studentJoinColumnFromUpload],
                          )
                        : introCourseParticipations.find(
                            (participation) =>
                              participation.student.matriculationNumber ===
                              (element as any)[joinColumns.values.studentJoinColumnFromUpload],
                          )

                    const tutor = joinColumns.values.withTutorAssignment
                      ? joinColumns.values.tutorJoinColumnFromTable === 'tumId'
                        ? tutors.find(
                            (tutor) =>
                              tutor.tumId ===
                              (element as any)[joinColumns.values.tutorJoinColumnFromUpload],
                          )
                        : tutors.find(
                            (tutor) =>
                              tutor.matriculationNumber ===
                              (element as any)[joinColumns.values.tutorJoinColumnFromUpload],
                          )
                      : undefined

                    if (introCourseParticipation) {
                      const seatPlanAssignment: SeatPlanAssignment = {
                        introCourseParticipationId: introCourseParticipation.id,
                        seat: (element as any)[joinColumns.values.seatJoinColumn],
                        tutorId: tutor?.id ?? undefined,
                      }
                      seatPlanAssignments.push(seatPlanAssignment)
                    }
                  })
                  void dispatch(createSeatPlanAssignments(seatPlanAssignments))
                } else {
                  if (selectedCourseIteration) {
                    const seatPlan: Seat[] = []
                    upload?.forEach((element) => {
                      const tutor = joinColumns.values.withTutorAssignment
                        ? joinColumns.values.tutorJoinColumnFromTable === 'tumId'
                          ? tutors.find(
                              (tutor) =>
                                tutor.tumId ===
                                (element as any)[joinColumns.values.tutorJoinColumnFromUpload],
                            )
                          : tutors.find(
                              (tutor) =>
                                tutor.matriculationNumber ===
                                (element as any)[joinColumns.values.tutorJoinColumnFromUpload],
                            )
                        : undefined

                      const seat: Seat = {
                        seat: (element as any)[joinColumns.values.seatJoinColumn],
                        chairDevice: (element as any)[joinColumns.values.withChairDeviceJoinColumn],
                        tutorId: tutor?.id ?? undefined,
                      }
                      seatPlan.push(seat)
                    })

                    void dispatch(
                      createSeatPlan({
                        courseIterationId: selectedCourseIteration.id,
                        seatPlan,
                      }),
                    )
                  }
                }
                close()
              }}
            >
              Upload
            </Button>
            {upload && (
              <Table striped withBorder withColumnBorders>
                <thead>
                  <tr>
                    {columnNames.map((columnName) => (
                      <th key={columnName}>{columnName}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {upload.map((element, idx) => (
                    <tr key={idx}>
                      {columnNames.map((columnName) => (
                        <td key={columnName}>{(element as any)[columnName]}</td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </Table>
            )}
          </Stack>
        </Stepper.Step>
      </Stepper>
    </Modal>
  )
}

interface SeatPlanEditModalProps {
  opened: boolean
  onClose: () => void
  introCourseParticipation: IntroCourseParticipation
  tutors: Student[]
  isTutor: boolean
}

const SeatPlanEditModal = ({
  opened,
  onClose,
  tutors,
  introCourseParticipation,
  isTutor,
}: SeatPlanEditModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const introCourseParticipationForm = useForm({
    initialValues: {
      tutorId: introCourseParticipation.tutorId ?? '',
      seat: introCourseParticipation.seat ?? '',
      chairDevice: introCourseParticipation.chairDevice ?? '',
    },
  })

  useEffect(() => {
    introCourseParticipationForm.setValues({
      tutorId: introCourseParticipation.tutorId ?? '',
      seat: introCourseParticipation.seat ?? '',
      chairDevice: introCourseParticipation.chairDevice ?? '',
    })
  }, [introCourseParticipation])

  const close = (): void => {
    introCourseParticipationForm.reset()
    onClose()
  }

  return (
    <Modal centered size='90%' opened={opened} onClose={close}>
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
      </Stack>
    </Modal>
  )
}

interface TechnicalDataEmailInvitationsSendConfirmationModalProps {
  opened: boolean
  onClose: () => void
}

const TechnicalDataEmailInvitationsSendConfirmationModal = ({
  opened,
  onClose,
}: TechnicalDataEmailInvitationsSendConfirmationModalProps): JSX.Element => {
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)

  return (
    <Modal opened={opened} onClose={onClose} centered>
      <Stack>
        <Text>
          Are You sure You would like to send email invitations to enrolled students in order to
          request them to submit technical details?
        </Text>
        <Group position='right'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedCourseIteration) {
                void sendInvitationsForStudentTechnicalDetailsSubmission(selectedCourseIteration.id)
              }
              onClose()
            }}
          >
            Confirm
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

interface SeatPlanManagerProps {
  keycloak: Keycloak
}

export const SeatPlanManager = ({ keycloak }: SeatPlanManagerProps): JSX.Element => {
  const participations = useAppSelector((state) => state.introCourse.participations)
  const tutors = useAppSelector((state) => state.introCourse.tutors)
  const downloadLinkRef = useRef<HTMLAnchorElement & { link: HTMLAnchorElement }>(null)
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tablePage, setTablePage] = useState(1)
  const [tableRecords, setTableRecords] = useState<IntroCourseParticipation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [tutorFilter, setTutorFilter] = useState<string[]>([])
  const [chairDeviceRequiredFilter, setChairDeviceRequiredFilter] = useState(false)
  const [selectedParticipation, setSelectedParticipation] =
    useState<IntroCourseParticipation | null>()
  const [participationEditModalOpened, setParticipationEditModalOpened] = useState(false)
  const [seatPlanUploadModalOpened, setSeatPlanUploadModalOpened] = useState(false)
  const [
    technicalDataInvitationsRequestModalOpened,
    setTechnicalDataInvitationsRequestModalOpened,
  ] = useState(false)

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize

    setTableRecords(
      participations
        .filter(({ student, seat }) => {
          return `${student.firstName?.toLowerCase() ?? ''} ${
            student.lastName?.toLowerCase() ?? ''
          } ${seat?.toLowerCase() ?? ''}`.includes(searchQuery.toLowerCase())
        })
        .filter(({ chairDevice }) =>
          chairDeviceRequiredFilter ? chairDevice && chairDevice.length !== 0 : true,
        )
        .filter(({ tutorId }) => {
          if (tutorFilter.length > 0) {
            return tutorId ? tutorFilter.includes(tutorId) : false
          }
          return true
        })
        .slice(from, to),
    )
  }, [
    participations,
    tablePageSize,
    tablePage,
    searchQuery,
    tutorFilter,
    chairDeviceRequiredFilter,
  ])

  return (
    <Stack>
      {selectedParticipation && (
        <SeatPlanEditModal
          opened={participationEditModalOpened}
          onClose={() => {
            setParticipationEditModalOpened(false)
          }}
          tutors={tutors}
          introCourseParticipation={selectedParticipation}
          isTutor={!keycloak.hasResourceRole('ipraktikum-pm', 'prompt-server')}
        />
      )}
      <TechnicalDataEmailInvitationsSendConfirmationModal
        opened={technicalDataInvitationsRequestModalOpened}
        onClose={() => {
          setTechnicalDataInvitationsRequestModalOpened(false)
        }}
      />
      {keycloak.hasResourceRole('ipraktikum-pm', 'prompt-server') && (
        <>
          <SeatPlanUploadModal
            opened={seatPlanUploadModalOpened}
            onClose={() => {
              setSeatPlanUploadModalOpened(false)
            }}
            introCourseParticipations={participations}
            tutors={tutors}
          />
          <CSVLink
            data={participations?.flatMap((participation) => {
              const tutor = tutors.find((tutor) => tutor.id === participation.tutorId)
              return {
                tumId: participation.student?.tumId,
                firstName: participation.student?.firstName,
                lastName: participation.student?.lastName,
                matriculationNumber: participation.student?.matriculationNumber,
                tutorTumId: tutor?.tumId ?? '-',
                tutorName: `${tutor?.firstName ?? '-'} ${tutor?.lastName ?? '-'}`,
                seat: participation.seat,
                needsChairDevice: participation.chairDevice ?? '-',
                appleId: participation.appleId,
                iPhoneDeviceId: participation.iPhoneDeviceId,
                iPadDeviceId: participation.iPadDeviceId,
                macBookDeviceId: participation.macBookDeviceId,
                appleWatchDeviceId: participation.appleWatchDeviceId,
              }
            })}
            filename='seat_plan.csv'
            style={{ display: 'hidden' }}
            ref={downloadLinkRef}
            target='_blank'
          />
          <Group position='apart'>
            <TextInput
              sx={{ flexBasis: '60%', margin: '1vh 0' }}
              placeholder='Search students...'
              icon={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.currentTarget.value)
              }}
            />
            <Group position='right'>
              <Tooltip
                label={
                  'Send Email Invitations to Enrolled Student to Request Technical Data such as Apple Id and Device Ids'
                }
                color='blue'
                withArrow
                multiline
              >
                <Button
                  variant='outline'
                  onClick={() => {
                    setTechnicalDataInvitationsRequestModalOpened(true)
                  }}
                >
                  <IconMail size={16} />
                </Button>
              </Tooltip>
              <Button
                variant='outline'
                leftIcon={<IconDownload size={16} />}
                onClick={() => {
                  downloadLinkRef.current?.link?.click()
                }}
              >
                Export
              </Button>
              <Button
                leftIcon={<IconUpload size={16} />}
                onClick={() => {
                  setSeatPlanUploadModalOpened(true)
                }}
              >
                Upload Seat Plan
              </Button>
            </Group>
          </Group>
        </>
      )}
      <DataTable
        withBorder
        minHeight={200}
        noRecordsText='No records to show'
        borderRadius='sm'
        withColumnBorders
        verticalSpacing='sm'
        striped
        highlightOnHover
        records={tableRecords}
        totalRecords={participations.length}
        recordsPerPage={tablePageSize}
        page={tablePage}
        onPageChange={(page) => {
          setTablePage(page)
        }}
        recordsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40]}
        onRecordsPerPageChange={(pageSize) => {
          setTablePageSize(pageSize)
        }}
        onRowClick={(introCourseParticipation) => {
          setSelectedParticipation(introCourseParticipation)
          setParticipationEditModalOpened(true)
        }}
        bodyRef={bodyRef}
        columns={[
          {
            accessor: 'fullName',
            title: 'Full Name',
            textAlignment: 'center',
            render: ({ student }) => `${student.firstName ?? ''} ${student.lastName ?? ''}`,
          },
          {
            accessor: 'tutorApplicationId',
            title: 'Tutor',
            textAlignment: 'center',
            filter: (
              <MultiSelect
                label='Tutor'
                description='Show students assigned to tutors...'
                data={tutors.map((tutor) => {
                  return {
                    label: `${tutor.firstName ?? ''} ${tutor.lastName ?? ''}`,
                    value: tutor.id,
                  }
                })}
                value={tutorFilter}
                placeholder='Search tutors...'
                onChange={setTutorFilter}
                icon={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: tutorFilter.length > 0,
            render: ({ tutorId }) =>
              `${tutors.filter((tutor) => tutor.id === tutorId).at(0)?.firstName ?? ''} ${
                tutors.filter((tutor) => tutor.id === tutorId).at(0)?.lastName ?? ''
              }`,
          },
          {
            accessor: 'seat',
            title: 'Seat',
            textAlignment: 'center',
          },
          {
            accessor: 'chairDeviceRequired',
            title: 'Chair Device',
            textAlignment: 'center',
            filter: (
              <Checkbox
                label='Chair Device'
                description='Show students who require chair device'
                checked={chairDeviceRequiredFilter}
                onChange={(event) => {
                  setChairDeviceRequiredFilter(event.currentTarget.checked)
                }}
              />
            ),
            filtering: chairDeviceRequiredFilter,
            render: ({ chairDevice }) => (
              <>
                {chairDevice && (
                  <Group position='center'>
                    <IconDeviceLaptop color='#2B70BE' />
                    <Text>{chairDevice}</Text>
                  </Group>
                )}
              </>
            ),
          },
          {
            accessor: 'actions',
            title: <Text mr='xs'>Actions</Text>,
            textAlignment: 'right',
            render: (participation) => (
              <Group spacing={4} position='right' noWrap>
                <Tooltip label='Edit'>
                  <ActionIcon
                    color='blue'
                    onClick={(e: React.MouseEvent) => {
                      setSelectedParticipation(participation)
                      setParticipationEditModalOpened(true)
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
        ]}
      />
    </Stack>
  )
}
