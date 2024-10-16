import { useState } from 'react'
import {
  Group,
  Tooltip,
  Text,
  Stack,
  Modal,
  Select,
  Button,
  FileInput,
  Table,
  Stepper,
  Card,
  Checkbox,
  Collapse,
} from '@mantine/core'
import { IconUpload } from '@tabler/icons-react'
import Daddy from 'papaparse'
import { type Student } from '../../../interface/application'
import { isNotEmpty, useForm } from '@mantine/form'
import { notifications } from '@mantine/notifications'
import { useCourseIterationStore } from '../../../state/zustand/useCourseIterationStore'
import { IntroCourseParticipation, Seat, SeatPlanAssignment } from '../../../interface/introCourse'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { postSeatPlan, postSeatPlanAssignment } from '../../../network/introCourse'
import { Query } from '../../../state/query'

interface SeatPlanUploadModalProps {
  opened: boolean
  onClose: () => void
  introCourseParticipations: IntroCourseParticipation[]
  tutors: Student[]
}

export const SeatPlanUploadModal = ({
  opened,
  onClose,
  introCourseParticipations,
  tutors,
}: SeatPlanUploadModalProps): JSX.Element => {
  const queryClient = useQueryClient()
  const { selectedCourseIteration } = useCourseIterationStore()
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

  const createSeatPlan = useMutation({
    mutationFn: (seatPlan: Seat[]) => postSeatPlan(selectedCourseIteration?.id ?? '', seatPlan),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE_PARTICIPATIONS] })
    },
  })

  const createSeatPlanAssignment = useMutation({
    mutationFn: (seatPlanAssignments: SeatPlanAssignment[]) =>
      postSeatPlanAssignment(seatPlanAssignments),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.INTRO_COURSE_PARTICIPATIONS] })
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
              leftSection={<IconUpload />}
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
                  {...joinColumns.getInputProps('withTutorAssignment', {
                    type: 'checkbox',
                  })}
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
                  {...joinColumns.getInputProps('withTutorAssignment', {
                    type: 'checkbox',
                  })}
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
                            (t) =>
                              t.tumId ===
                              (element as any)[joinColumns.values.tutorJoinColumnFromUpload],
                          )
                        : tutors.find(
                            (t) =>
                              t.matriculationNumber ===
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
                  createSeatPlanAssignment.mutate(seatPlanAssignments)
                } else {
                  if (selectedCourseIteration) {
                    const seatPlan: Seat[] = []
                    upload?.forEach((element) => {
                      const tutor = joinColumns.values.withTutorAssignment
                        ? joinColumns.values.tutorJoinColumnFromTable === 'tumId'
                          ? tutors.find(
                              (t) =>
                                t.tumId ===
                                (element as any)[joinColumns.values.tutorJoinColumnFromUpload],
                            )
                          : tutors.find(
                              (t) =>
                                t.matriculationNumber ===
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

                    createSeatPlan.mutate(seatPlan)
                  }
                }
                close()
              }}
            >
              Upload
            </Button>
            {upload && (
              <Table striped withTableBorder withColumnBorders>
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
