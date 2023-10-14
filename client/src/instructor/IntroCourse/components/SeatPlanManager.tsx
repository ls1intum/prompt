import { DataTable, type DataTableSortStatus } from 'mantine-datatable'
import sortBy from 'lodash/sortBy'
import { useAppSelector } from '../../../redux/store'
import { CSVLink } from 'react-csv'
import { useEffect, useRef, useState } from 'react'
import { type IntroCourseParticipation } from '../../../redux/introCourseSlice/introCourseSlice'
import {
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
import { sendInvitationsForStudentTechnicalDetailsSubmission } from '../../../service/introCourseService'
import {
  SkillProficiency,
  getBadgeColor,
} from '../../../redux/studentPostKickoffSubmissionsSlice/studentPostKickoffSubmissionsSlice'
import { IntroCourseEntryModal } from './IntroCourseEntryModal'
import { SeatPlanUploadModal } from './SeatPlanUploadModal'

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

interface Filters {
  passed: string[]
  tutors: string[]
  proficiency: string[]
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
  const [filters, setFilters] = useState<Filters>({ passed: [], proficiency: [], tutors: [] })
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
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
        .filter(({ passed, droppedOut }) => {
          if (filters.passed.length === 0) {
            return true
          } else if (droppedOut) {
            return filters.passed.includes('Dropped out')
          } else if (passed) {
            return filters.passed.includes('Passed')
          } else if (passed === false) {
            return filters.passed.includes('Not passed')
          } else if (passed === null) {
            return filters.passed.includes('Not assessed')
          }
          return false
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
  ])

  return (
    <Stack>
      {selectedParticipation && (
        <IntroCourseEntryModal
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
                iPhoneDeviceId: participation.iphoneDeviceId,
                iPadDeviceId: participation.ipadDeviceId,
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
              sx={{ flexBasis: '70%', margin: '1vh 0' }}
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
        onRowClick={(introCourseParticipation) => {
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
            textAlignment: 'center',
            render: ({ student, passed, droppedOut }) => (
              <Stack>
                {`${student.firstName ?? ''} ${student.lastName ?? ''}`}
                {passed !== null && (
                  <Badge color={droppedOut ? 'gray' : passed ? 'green' : 'red'} variant='outline'>
                    {droppedOut ? 'DROPPED OUT' : passed ? 'PASSED' : 'NOT PASSED'}
                  </Badge>
                )}
              </Stack>
            ),
            sortable: true,
            filter: (
              <MultiSelect
                label='Challenge Result'
                data={['Passed', 'Not passed', 'Not assessed', 'Dropped out']}
                value={filters.passed}
                onChange={(value) => {
                  setFilters({
                    ...filters,
                    passed: value,
                  })
                }}
                icon={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: filters.passed.length > 0,
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
                value={filters.tutors}
                placeholder='Search tutors...'
                onChange={(value) => {
                  setFilters({ ...filters, tutors: value })
                }}
                icon={<IconSearch size={16} />}
                clearable
                searchable
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
            textAlignment: 'center',
            render: ({
              appleId,
              iphoneDeviceId,
              ipadDeviceId,
              appleWatchDeviceId,
              macBookDeviceId,
            }) => (
              <>
                <Stack>
                  {!!appleId && (
                    <Group>
                      <IconBrandApple color='#2B70BE' />
                      <Text c='dimmed' fw='500'>
                        {appleId}
                      </Text>
                    </Group>
                  )}
                  {!!macBookDeviceId && (
                    <Group>
                      <IconDeviceLaptop color='#2B70BE' />
                      <Text c='dimmed' fw='500'>
                        {macBookDeviceId}
                      </Text>
                    </Group>
                  )}
                  {!!iphoneDeviceId && (
                    <Group>
                      <IconDeviceMobile color='#2B70BE' />
                      <Text c='dimmed' fw='500'>
                        {iphoneDeviceId}
                      </Text>
                    </Group>
                  )}
                  {!!ipadDeviceId && (
                    <Group>
                      <IconDeviceTablet color='#2B70BE' />
                      <Text c='dimmed' fw='500'>
                        {ipadDeviceId}
                      </Text>
                    </Group>
                  )}
                  {!!appleWatchDeviceId && (
                    <Group>
                      <IconDeviceWatch color='#2B70BE' />
                      <Text c='dimmed' fw='500'>
                        {appleWatchDeviceId}
                      </Text>
                    </Group>
                  )}
                </Stack>
              </>
            ),
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
            accessor: 'proficiency',
            title: 'Proficiency',
            textAlignment: 'right',
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
                icon={<IconSearch size={16} />}
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
