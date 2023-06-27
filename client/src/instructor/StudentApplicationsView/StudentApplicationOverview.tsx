import { Group, Text, Stack, ActionIcon, TextInput, Badge, Checkbox, Select } from '@mantine/core'
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import {
  type CoachApplication,
  type TutorApplication,
  type DeveloperApplication,
} from '../../redux/studentApplicationSlice/studentApplicationSlice'
import { fetchDeveloperApplications } from '../../redux/studentApplicationSlice/thunks/fetchDeveloperApplications'
import { StudentApplicationModal } from './StudentApplicationModal'
import { fetchCoachApplications } from '../../redux/studentApplicationSlice/thunks/fetchCoachApplications'
import { fetchTutorApplications } from '../../redux/studentApplicationSlice/thunks/fetchTutorApplications'

export const StudentApplicationOverview = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [applicationsFilter, setApplicationsFilter] = useState<string | null>('developer')
  const developerApplications = useAppSelector((state) => state.applications.developerApplications)
  const coachApplications = useAppSelector((state) => state.applications.coachApplications)
  const tutorApplications = useAppSelector((state) => state.applications.tutorApplications)
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const [developerApplicationModalOpen, setDeveloperApplicationModalOpen] = useState<
    DeveloperApplication | undefined
  >(undefined)
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tablePage, setTablePage] = useState(1)
  const [developerTableRecords, setDeveloperTableRecords] = useState<DeveloperApplication[]>([])
  const [coachTableRecords, setCoachTableRecords] = useState<CoachApplication[]>([])
  const [tutorTableRecords, setTutorTableRecords] = useState<TutorApplication[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyNotAssessed, setShowOnlyNotAssessed] = useState(false)

  useEffect(() => {
    if (selectedCourseIteration) {
      void dispatch(
        fetchDeveloperApplications({ courseIteration: selectedCourseIteration.semesterName }),
      )
      void dispatch(
        fetchCoachApplications({ courseIteration: selectedCourseIteration.semesterName }),
      )
      void dispatch(
        fetchTutorApplications({ courseIteration: selectedCourseIteration.semesterName }),
      )
    }
  }, [selectedCourseIteration])

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize

    if (applicationsFilter === 'developer') {
      setDeveloperTableRecords(
        developerApplications
          .filter(({ student }) => {
            return `${student.firstName ?? ''} ${student.lastName ?? ''} ${student.tumId ?? ''} ${
              student.matriculationNumber ?? ''
            }`.includes(searchQuery)
          })
          .filter((studentApplication) =>
            showOnlyNotAssessed ? !studentApplication.assessment.assessed : true,
          )
          .slice(from, to),
      )
    } else if (applicationsFilter === 'coach') {
      setCoachTableRecords(
        coachApplications
          .filter(({ student }) => {
            return `${student.firstName ?? ''} ${student.lastName ?? ''} ${student.email ?? ''} ${
              student.tumId ?? ''
            } ${student.matriculationNumber ?? ''}`.includes(searchQuery)
          })
          .filter((studentApplication) =>
            showOnlyNotAssessed ? !studentApplication.assessment.assessed : true,
          )
          .slice(from, to),
      )
    } else if (applicationsFilter === 'tutor') {
      setTutorTableRecords(
        tutorApplications
          .filter(({ student }) => {
            return `${student.firstName ?? ''} ${student.lastName ?? ''} ${student.email ?? ''} ${
              student.tumId ?? ''
            } ${student.matriculationNumber ?? ''}`.includes(searchQuery)
          })
          .filter((studentApplication) =>
            showOnlyNotAssessed ? !studentApplication.assessment.assessed : true,
          )
          .slice(from, to),
      )
    }
  }, [
    applicationsFilter,
    developerApplications,
    coachApplications,
    tutorApplications,
    tablePageSize,
    tablePage,
    searchQuery,
    showOnlyNotAssessed,
  ])

  return (
    <div>
      {developerApplicationModalOpen && (
        <StudentApplicationModal
          open={!!developerApplicationModalOpen}
          onClose={() => {
            setDeveloperApplicationModalOpen(undefined)
          }}
          studentApplication={developerApplicationModalOpen}
        />
      )}
      <Group>
        <TextInput
          sx={{ flexBasis: '60%', margin: '1vh 0' }}
          placeholder='Search student applications...'
          icon={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.currentTarget.value)
          }}
        />
        <Select
          value={applicationsFilter}
          onChange={setApplicationsFilter}
          data={[
            { value: 'developer', label: 'Developer' },
            { value: 'coach', label: 'Coach' },
            { value: 'tutor', label: 'Tutor' },
          ]}
        />
        <Checkbox
          label='Show only not assessed'
          checked={showOnlyNotAssessed}
          onChange={(e) => {
            setShowOnlyNotAssessed(e.currentTarget.checked)
          }}
        />
      </Group>
      {applicationsFilter === 'developer' && (
        <DataTable
          withBorder
          minHeight={200}
          noRecordsText='No records to show'
          borderRadius='sm'
          withColumnBorders
          verticalSpacing='md'
          striped
          highlightOnHover
          totalRecords={developerApplications.length}
          recordsPerPage={tablePageSize}
          page={tablePage}
          onPageChange={(page) => {
            setTablePage(page)
          }}
          recordsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40]}
          onRecordsPerPageChange={(pageSize) => {
            setTablePageSize(pageSize)
          }}
          rowExpansion={{
            allowMultiple: true,
            collapseProps: {
              transitionDuration: 500,
              animateOpacity: false,
              transitionTimingFunction: 'ease-out',
            },
            content: ({ record }) => (
              <Stack p='xs' spacing={6}>
                <Group spacing={6}>
                  <Text>
                    {record.student.firstName}, {record.student.lastName}, {record.student.tumId}
                  </Text>
                </Group>
                <Group>
                  <Text>Motivation</Text>
                  <Text>{record.motivation}</Text>
                </Group>
                <Group>
                  <Text>Experience</Text>
                  <Text>{record.experience}</Text>
                </Group>
              </Stack>
            ),
          }}
          records={developerTableRecords}
          columns={[
            {
              accessor: 'applicationStatus',
              title: <Text>Application Status</Text>,
              render: (studentApplication) => {
                const isAccepted = studentApplication.assessment.accepted
                const isAssessed = studentApplication.assessment.assessed
                return (
                  <Badge color={isAccepted ? 'green' : isAssessed ? 'red' : 'gray'}>
                    {isAccepted ? 'Accepted' : isAssessed ? 'Rejected' : 'Not Assessed'}
                  </Badge>
                )
              },
            },
            {
              accessor: 'student.tumId',
              title: 'TUM ID',
            },
            {
              accessor: 'student.matriculationNumber',
              title: 'Matriculation Nr.',
            },
            {
              accessor: 'student.email',
              title: 'Email',
            },
            { accessor: 'student.firstName', title: 'First Name' },
            { accessor: 'student.lastName', title: 'Last Name' },
            {
              accessor: 'actions',
              title: <Text mr='xs'>Actions</Text>,
              textAlignment: 'right',
              render: (studentApplication) => (
                <Group spacing={4} position='right' noWrap>
                  <ActionIcon
                    color='blue'
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      setDeveloperApplicationModalOpen(studentApplication)
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon color='red' onClick={() => {}}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
          /* onRowClick={({ firstName }: StudentApplication) => {
          alert(`You clicked on ${firstName}`)
        }} */
        />
      )}
      {applicationsFilter === 'coach' && (
        <DataTable
          withBorder
          minHeight={200}
          noRecordsText='No records to show'
          borderRadius='sm'
          withColumnBorders
          verticalSpacing='md'
          striped
          highlightOnHover
          totalRecords={coachApplications.length}
          recordsPerPage={tablePageSize}
          page={tablePage}
          onPageChange={(page) => {
            setTablePage(page)
          }}
          recordsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40]}
          onRecordsPerPageChange={(pageSize) => {
            setTablePageSize(pageSize)
          }}
          rowExpansion={{
            allowMultiple: true,
            collapseProps: {
              transitionDuration: 500,
              animateOpacity: false,
              transitionTimingFunction: 'ease-out',
            },
            content: ({ record }) => (
              <Stack p='xs' spacing={6}>
                <Group spacing={6}>
                  <Text>
                    {record.student.firstName}, {record.student.lastName}, {record.student.tumId}
                  </Text>
                </Group>
                <Group>
                  <Text>Motivation</Text>
                  <Text>{record.motivation}</Text>
                </Group>
                <Group>
                  <Text>Experience</Text>
                  <Text>{record.experience}</Text>
                </Group>
              </Stack>
            ),
          }}
          records={coachTableRecords}
          columns={[
            {
              accessor: 'applicationStatus',
              title: <Text>Application Status</Text>,
              render: (studentApplication) => {
                const isAccepted = studentApplication.assessment.accepted
                const isAssessed = studentApplication.assessment.assessed
                return (
                  <Badge color={isAccepted ? 'green' : isAssessed ? 'red' : 'gray'}>
                    {isAccepted ? 'Accepted' : isAssessed ? 'Rejected' : 'Not Assessed'}
                  </Badge>
                )
              },
            },
            {
              accessor: 'student.tumId',
              title: 'TUM ID',
            },
            { accessor: 'student.firstName', title: 'First Name' },
            { accessor: 'student.lastName', title: 'Last Name' },
            {
              accessor: 'actions',
              title: <Text mr='xs'>Actions</Text>,
              textAlignment: 'right',
              render: (studentApplication) => (
                <Group spacing={4} position='right' noWrap>
                  <ActionIcon
                    color='blue'
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      setDeveloperApplicationModalOpen(studentApplication)
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon color='red' onClick={() => {}}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
          /* onRowClick={({ firstName }: StudentApplication) => {
          alert(`You clicked on ${firstName}`)
        }} */
        />
      )}
      {applicationsFilter === 'tutor' && (
        <DataTable
          withBorder
          minHeight={200}
          noRecordsText='No records to show'
          borderRadius='sm'
          withColumnBorders
          verticalSpacing='md'
          striped
          highlightOnHover
          totalRecords={tutorApplications.length}
          recordsPerPage={tablePageSize}
          page={tablePage}
          onPageChange={(page) => {
            setTablePage(page)
          }}
          recordsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40]}
          onRecordsPerPageChange={(pageSize) => {
            setTablePageSize(pageSize)
          }}
          rowExpansion={{
            allowMultiple: true,
            collapseProps: {
              transitionDuration: 500,
              animateOpacity: false,
              transitionTimingFunction: 'ease-out',
            },
            content: ({ record }) => (
              <Stack p='xs' spacing={6}>
                <Group spacing={6}>
                  <Text>
                    {record.student.firstName}, {record.student.lastName}, {record.student.tumId}
                  </Text>
                </Group>
                <Group>
                  <Text>Motivation</Text>
                  <Text>{record.motivation}</Text>
                </Group>
                <Group>
                  <Text>Experience</Text>
                  <Text>{record.experience}</Text>
                </Group>
              </Stack>
            ),
          }}
          records={tutorTableRecords}
          columns={[
            {
              accessor: 'applicationStatus',
              title: <Text>Application Status</Text>,
              render: (studentApplication) => {
                const isAccepted = studentApplication.assessment.accepted
                const isAssessed = studentApplication.assessment.assessed
                return (
                  <Badge color={isAccepted ? 'green' : isAssessed ? 'red' : 'gray'}>
                    {isAccepted ? 'Accepted' : isAssessed ? 'Rejected' : 'Not Assessed'}
                  </Badge>
                )
              },
            },
            {
              accessor: 'student.tumId',
              title: 'TUM ID',
            },
            { accessor: 'student.firstName', title: 'First Name' },
            { accessor: 'student.lastName', title: 'Last Name' },
            {
              accessor: 'actions',
              title: <Text mr='xs'>Actions</Text>,
              textAlignment: 'right',
              render: (studentApplication) => (
                <Group spacing={4} position='right' noWrap>
                  <ActionIcon
                    color='blue'
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                      setDeveloperApplicationModalOpen(studentApplication)
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                  <ActionIcon color='red' onClick={() => {}}>
                    <IconTrash size={16} />
                  </ActionIcon>
                </Group>
              ),
            },
          ]}
          /* onRowClick={({ firstName }: StudentApplication) => {
          alert(`You clicked on ${firstName}`)
        }} */
        />
      )}
    </div>
  )
}
