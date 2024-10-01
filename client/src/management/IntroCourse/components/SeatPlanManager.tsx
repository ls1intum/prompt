import { DataTable, type DataTableSortStatus } from 'mantine-datatable'
import sortBy from 'lodash/sortBy'
import { CSVLink } from 'react-csv'
import { useEffect, useRef, useState } from 'react'
import {
  Center,
  Group,
  Tooltip,
  Text,
  Stack,
  TextInput,
  Modal,
  Button,
  MultiSelect,
  Checkbox,
  Badge,
} from '@mantine/core'
import {
  IconBrandApple,
  IconDeviceLaptop,
  IconDeviceMobile,
  IconDeviceTablet,
  IconDeviceWatch,
  IconDownload,
  IconMail,
  IconSearch,
  IconUpload,
} from '@tabler/icons-react'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import type Keycloak from 'keycloak-js'
import { IntroCourseEntryModal } from './IntroCourseEntryModal'
import { SeatPlanUploadModal } from './SeatPlanUploadModal'
import { useCourseIterationStore } from '../../../state/zustand/useCourseIterationStore'
import { useIntroCourseStore } from '../../../state/zustand/useIntroCourseStore'
import { IntroCourseParticipation } from '../../../interface/introCourse'
import { postInvitationsToTechnicalDetailsSubmission } from '../../../network/introCourse'
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

interface TechnicalDataEmailInvitationsSendConfirmationModalProps {
  opened: boolean
  onClose: () => void
}

const TechnicalDataEmailInvitationsSendConfirmationModal = ({
  opened,
  onClose,
}: TechnicalDataEmailInvitationsSendConfirmationModalProps): JSX.Element => {
  const { selectedCourseIteration } = useCourseIterationStore()

  return (
    <Modal opened={opened} onClose={onClose} centered>
      <Stack>
        <Text>
          Are You sure You would like to send email invitations to enrolled students in order to
          request them to submit technical details?
        </Text>
        <Group align='right'>
          <Button variant='outline' onClick={onClose}>
            Cancel
          </Button>
          <Button
            onClick={() => {
              if (selectedCourseIteration) {
                void postInvitationsToTechnicalDetailsSubmission(selectedCourseIteration.id)
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

interface Filters {
  passed: string[]
  showOnlyDroppedOut: boolean
  excludeDroppedOut: boolean
  tutors: string[]
  proficiency: string[]
}

interface SeatPlanManagerProps {
  keycloak: Keycloak
}

export const SeatPlanManager = ({ keycloak }: SeatPlanManagerProps): JSX.Element => {
  const { participations, tutors } = useIntroCourseStore()
  const downloadLinkRef = useRef<HTMLAnchorElement & { link: HTMLAnchorElement }>(null)
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tablePage, setTablePage] = useState(1)
  const [tableRecords, setTableRecords] = useState<IntroCourseParticipation[]>([])
  const [totalDisplayedRecords, setTotalDisplayedRecords] = useState(participations.length)
  const [searchQuery, setSearchQuery] = useState('')
  const [chairDeviceRequiredFilter, setChairDeviceRequiredFilter] = useState(false)
  const [selectedParticipation, setSelectedParticipation] =
    useState<IntroCourseParticipation | null>()
  const [participationEditModalOpened, setParticipationEditModalOpened] = useState(false)
  const [seatPlanUploadModalOpened, setSeatPlanUploadModalOpened] = useState(false)
  const [
    technicalDataInvitationsRequestModalOpened,
    setTechnicalDataInvitationsRequestModalOpened,
  ] = useState(false)
  const [filters, setFilters] = useState<Filters>({
    passed: [],
    proficiency: [],
    tutors: [],
    showOnlyDroppedOut: false,
    excludeDroppedOut: false,
  })
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<IntroCourseParticipation>>({
    columnAccessor: 'fullName',
    direction: 'asc',
  })

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize

    if (selectedParticipation) {
      setSelectedParticipation(
        participations.find(({ id }) => id === selectedParticipation.id) ?? null,
      )
    }

    const filteredData = sortBy(
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
          if (filters.tutors.length > 0) {
            return tutorId ? filters.tutors.includes(tutorId) : false
          }
          return true
        })
        .filter(({ passed }) => {
          if (filters.passed.length === 0) {
            return true
          } else if (passed) {
            return filters.passed.includes('Passed')
          } else if (passed === false) {
            return filters.passed.includes('Not passed')
          } else if (passed === null) {
            return filters.passed.includes('Not assessed')
          }
          return false
        })
        .filter(({ droppedOut }) => {
          if (filters.showOnlyDroppedOut) {
            return droppedOut
          } else if (filters.excludeDroppedOut) {
            return !droppedOut
          }
          return true
        })
        .filter(({ supervisorAssessment }) => {
          if (filters.proficiency.length > 0) {
            return supervisorAssessment ? filters.proficiency.includes(supervisorAssessment) : false
          }
          return true
        }),
      sortStatus.columnAccessor === 'fullName'
        ? ['student.firstName', 'student.lastName']
        : sortStatus.columnAccessor,
    )

    setTotalDisplayedRecords(filteredData.length)
    if (from > filteredData.length) {
      setTablePage(1)
    }

    setTableRecords(
      (sortStatus.direction === 'desc' ? filteredData.reverse() : filteredData).slice(from, to),
    )
  }, [
    participations,
    tablePageSize,
    tablePage,
    searchQuery,
    filters,
    chairDeviceRequiredFilter,
    sortStatus,
    selectedParticipation,
  ])

  return (
    <Stack>
      {selectedParticipation && (
        <IntroCourseEntryModal
          opened={participationEditModalOpened}
          onClose={() => {
            setParticipationEditModalOpened(false)
            setSelectedParticipation(null)
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
              const tutor = tutors.find((t) => t.id === participation.tutorId)
              return {
                tumId: participation.student?.tumId,
                firstName: participation.student?.firstName,
                lastName: participation.student?.lastName,
                matriculationNumber: participation.student?.matriculationNumber,
                tutorTumId: tutor?.tumId ?? '-',
                tutorName: `${tutor?.firstName ?? '-'} ${tutor?.lastName ?? '-'}`,
                seat: participation.seat,
                needsChairDevice: participation.chairDevice ?? '-',
                appleId: participation.student.developmentProfile?.appleId,
                iPhoneDeviceId: participation.student.developmentProfile?.iPhoneDeviceId,
                iPadDeviceId: participation.student.developmentProfile?.iPadDeviceId,
                macBookDeviceId: participation.student.developmentProfile?.macBookDeviceId,
                appleWatchDeviceId: participation.student.developmentProfile?.appleWatchDeviceId,
              }
            })}
            filename='seat_plan.csv'
            style={{ display: 'hidden' }}
            ref={downloadLinkRef}
            target='_blank'
          />
          <Group align='apart' style={{ alignItems: 'center' }}>
            <TextInput
              style={{ flexBasis: '70%', margin: '1vh 0' }}
              placeholder='Search students...'
              leftSection={<IconSearch size={16} />}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.currentTarget.value)
              }}
            />
            <Group align='right'>
              <Tooltip
                label={
                  'Send Email Invitations to Enrolled Student to Request Technical Data such as Apple Id and Device Ids'
                }
                color='blue'
                withArrow
                multiline
              >
                <Button
                  variant='light'
                  onClick={() => {
                    setTechnicalDataInvitationsRequestModalOpened(true)
                  }}
                >
                  <IconMail size={16} />
                </Button>
              </Tooltip>
              <Button
                variant='light'
                leftSection={<IconDownload size={16} />}
                onClick={() => {
                  downloadLinkRef.current?.link?.click()
                }}
              >
                Export
              </Button>
              <Button
                leftSection={<IconUpload size={16} />}
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
        withTableBorder
        minHeight={200}
        noRecordsText='No records to show'
        borderRadius='sm'
        verticalSpacing='sm'
        striped
        highlightOnHover
        records={tableRecords}
        totalRecords={totalDisplayedRecords}
        recordsPerPage={tablePageSize}
        page={tablePage}
        onPageChange={(page) => {
          setTablePage(page)
        }}
        recordsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40]}
        onRecordsPerPageChange={(pageSize) => {
          setTablePageSize(pageSize)
        }}
        onRowClick={({ record: introCourseParticipation }) => {
          setSelectedParticipation(introCourseParticipation)
          setParticipationEditModalOpened(true)
        }}
        bodyRef={bodyRef}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        columns={[
          {
            accessor: 'fullName',
            title: 'Full Name',
            textAlign: 'center',
            render: ({ student, passed, droppedOut }) => (
              <Stack>
                {`${student.firstName ?? ''} ${student.lastName ?? ''}`}
                <Center>
                  <Stack>
                    <Center>
                      {passed !== null && (
                        <Badge color={passed ? 'green' : 'red'} variant='outline'>
                          {passed ? 'PASSED' : 'NOT PASSED'}
                        </Badge>
                      )}
                    </Center>
                    <Center>
                      {droppedOut && (
                        <Badge color='gray' variant='outline'>
                          DROPPED OUT
                        </Badge>
                      )}
                    </Center>
                  </Stack>
                </Center>
              </Stack>
            ),
            sortable: true,
            filter: (
              <Stack>
                <MultiSelect
                  label='Challenge Result'
                  data={['Passed', 'Not passed', 'Not assessed']}
                  value={filters.passed}
                  onChange={(value) => {
                    setFilters({
                      ...filters,
                      passed: value,
                    })
                  }}
                  leftSection={<IconSearch size={16} />}
                  clearable
                  searchable
                  comboboxProps={{ withinPortal: false }}
                />
                <Checkbox
                  label='Show only dropped out?'
                  checked={filters.showOnlyDroppedOut}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      showOnlyDroppedOut: event.currentTarget.checked,
                      excludeDroppedOut: false,
                    })
                  }}
                />
                <Checkbox
                  label='Exclude dropped put?'
                  checked={filters.excludeDroppedOut}
                  onChange={(event) => {
                    setFilters({
                      ...filters,
                      excludeDroppedOut: event.currentTarget.checked,
                      showOnlyDroppedOut: false,
                    })
                  }}
                />
              </Stack>
            ),
            filtering:
              filters.passed.length > 0 || filters.showOnlyDroppedOut || filters.excludeDroppedOut,
          },
          {
            accessor: 'tutorApplicationId',
            title: 'Tutor',
            textAlign: 'center',
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
                value={filters.tutors}
                placeholder='Search tutors...'
                onChange={(value) => {
                  setFilters({ ...filters, tutors: value })
                }}
                leftSection={<IconSearch size={16} />}
                clearable
                searchable
                comboboxProps={{ withinPortal: false }}
              />
            ),
            filtering: filters.tutors.length > 0,
            render: ({ tutorId }) =>
              `${tutors.filter((tutor) => tutor.id === tutorId).at(0)?.firstName ?? ''} ${
                tutors.filter((tutor) => tutor.id === tutorId).at(0)?.lastName ?? ''
              }`,
          },
          {
            accessor: 'devices',
            title: 'Devices',
            textAlign: 'center',
            render: ({ student }) => {
              const { appleId, iPhoneDeviceId, iPadDeviceId, appleWatchDeviceId, macBookDeviceId } =
                student.developmentProfile ?? {}

              return (
                <>
                  <Stack>
                    {!!appleId && (
                      <Group>
                        <IconBrandApple color='#2B70BE' />
                        <Text c='dimmed' fw='500' fz='sm'>
                          {appleId}
                        </Text>
                      </Group>
                    )}
                    {!!macBookDeviceId && (
                      <Group>
                        <IconDeviceLaptop color='#2B70BE' />
                        <Text c='dimmed' fw='500' fz='sm'>
                          {macBookDeviceId}
                        </Text>
                      </Group>
                    )}
                    {!!iPhoneDeviceId && (
                      <Group>
                        <IconDeviceMobile color='#2B70BE' />
                        <Text c='dimmed' fw='500' fz='sm'>
                          {iPhoneDeviceId}
                        </Text>
                      </Group>
                    )}
                    {!!iPadDeviceId && (
                      <Group>
                        <IconDeviceTablet color='#2B70BE' />
                        <Text c='dimmed' fw='500' fz='sm'>
                          {iPadDeviceId}
                        </Text>
                      </Group>
                    )}
                    {!!appleWatchDeviceId && (
                      <Group>
                        <IconDeviceWatch color='#2B70BE' />
                        <Text c='dimmed' fw='500' fz='sm'>
                          {appleWatchDeviceId}
                        </Text>
                      </Group>
                    )}
                  </Stack>
                </>
              )
            },
          },
          {
            accessor: 'seat',
            title: 'Seat',
            textAlign: 'center',
          },
          {
            accessor: 'chairDeviceRequired',
            title: 'Chair Device',
            textAlign: 'center',
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
              <Center>
                {chairDevice && (
                  <Group align='center'>
                    <IconDeviceLaptop color='#2B70BE' />
                    <Text>{chairDevice}</Text>
                  </Group>
                )}
              </Center>
            ),
          },
          {
            accessor: 'proficiency',
            title: 'Proficiency',
            textAlign: 'center',
            filter: (
              <MultiSelect
                label='Proficiency'
                data={Object.keys(SkillProficiency).map((key) => {
                  return {
                    label: SkillProficiency[key as keyof typeof SkillProficiency],
                    value: key,
                  }
                })}
                value={filters.proficiency}
                placeholder='Proficiency...'
                onChange={(value) => {
                  setFilters({
                    ...filters,
                    proficiency: value,
                  })
                }}
                leftSection={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: filters.proficiency?.length > 0,
            render: ({ supervisorAssessment }) => {
              return (
                <>
                  {supervisorAssessment && (
                    <Badge color={getBadgeColor(supervisorAssessment)}>
                      {supervisorAssessment}
                    </Badge>
                  )}
                </>
              )
            },
          },
        ]}
      />
    </Stack>
  )
}
