import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import sortBy from 'lodash/sortBy'
import { useAppSelector, type AppDispatch } from '../../../redux/store'
import { fetchThesisApplications } from '../../../redux/thesisApplicationsSlice/thunks/fetchThesisApplications'
import { ApplicationStatus, Gender } from '../../../redux/applicationsSlice/applicationsSlice'
import { ActionIcon, Badge, Group, Modal, MultiSelect, Stack, Text, TextInput } from '@mantine/core'
import { DataTable, type DataTableSortStatus } from 'mantine-datatable'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { type ThesisApplication } from '../../../redux/thesisApplicationsSlice/thesisApplicationsSlice'
import { IconExternalLink, IconEyeEdit, IconSearch } from '@tabler/icons-react'
import { ThesisApplicationForm } from '../../../forms/ThesisApplicationForm'
import { ApplicationFormAccessMode } from '../../../forms/DefaultApplicationForm'
import moment from 'moment'
import { fetchThesisAdvisors } from '../../../redux/thesisApplicationsSlice/thunks/fetchThesisAdvisors'
import { Link, useNavigate, useParams } from 'react-router-dom'

interface Filters {
  male: boolean
  female: boolean
  status: string[]
}

export const ThesisApplicationsDatatable = (): JSX.Element => {
  const { applicationId } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()
  const isLoading = useAppSelector((state) => state.thesisApplications.status === 'pending')
  const applications = useAppSelector((state) => state.thesisApplications.applications)
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
  const [searchQuery, setSearchQuery] = useState('')
  const [tablePage, setTablePage] = useState(1)
  const [totalDisplayedRecords, setTotalDisplayedRecords] = useState(applications.length)
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tableRecords, setTableRecords] = useState<ThesisApplication[]>([])
  const [selectedTableRecords, setSelectedTableRecords] = useState<ThesisApplication[]>([])
  const [selectedApplicationToView, setSelectedApplicationToView] = useState<
    ThesisApplication | undefined
  >(undefined)
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<ThesisApplication>>({
    columnAccessor: 'createdAt',
    direction: 'desc',
  })
  const [filters, setFilters] = useState<Filters>({
    male: false,
    female: false,
    status: [],
  })

  useEffect(() => {
    void dispatch(fetchThesisApplications(ApplicationStatus.NOT_ASSESSED))
    void dispatch(fetchThesisAdvisors())
  }, [dispatch])

  useEffect(() => {
    if (applicationId) {
      setSelectedApplicationToView(applications.find((a) => a.id === applicationId))
    } else {
      setSelectedApplicationToView(undefined)
    }
  }, [applications, applicationId])

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize

    const filteredSortedData = sortBy(
      applications
        .filter(({ student }) => {
          return `${student.firstName ?? ''} ${student.lastName ?? ''} ${student.tumId ?? ''} ${
            student.matriculationNumber ?? ''
          }`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        })
        .filter(
          (application) =>
            filters.status.length === 0 || filters.status.includes(application.applicationStatus),
        )
        .filter((application) =>
          filters.female && application.student.gender
            ? Gender[application.student.gender] === Gender.FEMALE
            : true,
        )
        .filter((application) =>
          filters.male && application.student.gender
            ? Gender[application.student.gender] === Gender.MALE
            : true,
        ),
      sortStatus.columnAccessor === 'fullName'
        ? ['student.firstName', 'student.lastName']
        : sortStatus.columnAccessor,
    )

    setTotalDisplayedRecords(filteredSortedData.length)

    setTableRecords(
      (sortStatus.direction === 'desc' ? filteredSortedData.reverse() : filteredSortedData).slice(
        from,
        to,
      ),
    )

    if (selectedApplicationToView) {
      setSelectedApplicationToView(
        applications.filter((ca) => ca.id === selectedApplicationToView.id).at(0),
      )
    }
  }, [
    applications,
    tablePageSize,
    tablePage,
    searchQuery,
    filters,
    sortStatus,
    selectedApplicationToView,
  ])

  return (
    <Stack>
      {selectedApplicationToView && (
        <Modal
          centered
          size='90%'
          opened={!!selectedApplicationToView}
          onClose={() => {
            navigate('/management/thesis-applications')
            setSelectedApplicationToView(undefined)
          }}
        >
          <ThesisApplicationForm
            application={selectedApplicationToView}
            accessMode={ApplicationFormAccessMode.INSTRUCTOR}
          />
        </Modal>
      )}
      <TextInput
        style={{ margin: '1vh 0', width: '30vw' }}
        placeholder='Search applications...'
        leftSection={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.currentTarget.value)
        }}
      />
      <DataTable
        fetching={isLoading}
        withTableBorder
        minHeight={200}
        noRecordsText='No records to show'
        borderRadius='sm'
        withColumnBorders
        verticalSpacing='md'
        striped
        highlightOnHover
        totalRecords={totalDisplayedRecords}
        recordsPerPage={tablePageSize}
        page={tablePage}
        onPageChange={(page) => {
          setTablePage(page)
        }}
        recordsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40, 50, 100, 200, 300]}
        onRecordsPerPageChange={(pageSize) => {
          setTablePageSize(pageSize)
        }}
        sortStatus={sortStatus}
        onSortStatusChange={setSortStatus}
        bodyRef={bodyRef}
        records={tableRecords}
        selectedRecords={selectedTableRecords}
        onSelectedRecordsChange={setSelectedTableRecords}
        columns={[
          {
            accessor: 'application_status',
            title: 'Status',
            textAlign: 'center',
            filter: (
              <MultiSelect
                label='Status'
                description='Show all applications having status in'
                data={Object.keys(ApplicationStatus).map((key) => {
                  return {
                    label: ApplicationStatus[key as keyof typeof ApplicationStatus],
                    value: key,
                  }
                })}
                value={filters.status}
                placeholder='Search status...'
                onChange={(value) => {
                  setFilters({
                    ...filters,
                    status: value,
                  })
                }}
                leftSection={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: filters.status.length > 0,
            render: (application) => {
              let color: string = 'gray'
              switch (application.applicationStatus) {
                case 'ACCEPTED':
                  color = 'green'
                  break
                case 'ENROLLED':
                  color = 'green'
                  break
                case 'REJECTED':
                  color = 'red'
                  break
                default:
                  break
              }
              return <Badge color={color}>{ApplicationStatus[application.applicationStatus]}</Badge>
            },
          },
          {
            accessor: 'student.tumId',
            title: 'TUM ID',
            sortable: true,
          },
          {
            accessor: 'student.matriculationNumber',
            title: 'Matriculation Nr.',
            sortable: true,
          },
          {
            accessor: 'student.email',
            title: 'Email',
            sortable: true,
          },
          {
            accessor: 'fullName',
            title: 'Full name',
            sortable: true,
            render: (application) =>
              `${application.student.firstName ?? ''} ${application.student.lastName ?? ''}`,
          },
          {
            accessor: 'createdAt',
            title: 'Created At',
            sortable: true,
            render: (application) =>
              `${moment(application.createdAt).format('DD. MMMM YYYY HH:mm')}`,
          },
          {
            accessor: 'actions',
            title: <Text mr='xs'>Actions</Text>,
            textAlign: 'right',
            render: (application) => (
              <Group align='right' wrap='nowrap'>
                <ActionIcon
                  color='blue'
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    navigate(`/management/thesis-applications/${application.id}`)
                  }}
                >
                  <IconEyeEdit size={16} />
                </ActionIcon>
                <Link
                  to={`/management/thesis-applications/${application.id}`}
                  target='_blank'
                  rel='noopener noreferrer'
                >
                  <ActionIcon
                    color='blue'
                    onClick={(e: React.MouseEvent) => {
                      e.stopPropagation()
                    }}
                  >
                    <IconExternalLink size={16} />
                  </ActionIcon>
                </Link>
              </Group>
            ),
          },
        ]}
        onRowClick={({ record: application }) => {
          navigate(`/management/thesis-applications/${application.id}`)
        }}
      />
    </Stack>
  )
}
