import { DataTable, type DataTableSortStatus } from 'mantine-datatable'
import sortBy from 'lodash/sortBy'
import { CSVLink } from 'react-csv'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import {
  Gender,
  type Application,
  ApplicationStatus,
  ApplicationType,
} from '../../../interface/application'
import { ActionIcon, Badge, Group, Modal, MultiSelect, Stack } from '@mantine/core'
import { IconDownload, IconEyeEdit, IconSearch, IconTrash } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { DeveloperApplicationForm } from '../../../forms/DeveloperApplicationForm'
import { ApplicationFormAccessMode } from '../../../forms/DefaultApplicationForm'
import { ConfirmationModal } from '../../../utilities/ConfirmationModal'
import { type Filters } from '../ApplicationOverview'
import { CoachApplicationForm } from '../../../forms/CoachApplicationForm'
import { TutorApplicationForm } from '../../../forms/TutorApplicationForm'
import { useContextMenu } from 'mantine-contextmenu'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { deleteApplication } from '../../../network/application'
import { Query } from '../../../state/query'

interface ApplicationDatatableProps {
  developerApplications: Application[]
  coachApplications: Application[]
  tutorApplications: Application[]
  searchQuery: string
  filters: Filters
  setFilters: (filters: Filters) => void
  isLoading: boolean
}

export const ApplicationDatatable = ({
  developerApplications,
  coachApplications,
  tutorApplications,
  searchQuery,
  filters,
  setFilters,
  isLoading,
}: ApplicationDatatableProps): JSX.Element => {
  const queryClient = useQueryClient()
  const { showContextMenu } = useContextMenu()
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
  const downloadLinkRef = useRef<HTMLAnchorElement & { link: HTMLAnchorElement }>(null)
  const [tablePage, setTablePage] = useState(1)
  const [totalDisplayedRecords, setTotalDisplayedRecords] = useState(
    developerApplications.length + coachApplications.length + tutorApplications.length,
  )
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tableRecords, setTableRecords] = useState<Application[]>([])
  const [selectedTableRecords, setSelectedTableRecords] = useState<Application[]>([])
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus<Application>>({
    columnAccessor: 'fullName',
    direction: 'asc',
  })
  const [selectedApplicationToView, setSelectedApplicationToView] = useState<
    Application | undefined
  >(undefined)
  const [selectedApplicationToDelete, setSelectedApplicationToDelete] = useState<
    Application | undefined
  >(undefined)
  const [bulkDeleteConfirmationOpened, setBulkDeleteConfirmationOpened] = useState(false)

  const removeApplication = useMutation({
    mutationFn: (vars: { applicationType: ApplicationType; applicationId: string }) =>
      deleteApplication(vars.applicationType, vars.applicationId),
    onSuccess: (data, variables) => {
      if (variables.applicationType === ApplicationType.DEVELOPER) {
        queryClient.invalidateQueries({ queryKey: [Query.DEVELOPER_APPLICATION] })
      }
      if (variables.applicationType === ApplicationType.COACH) {
        queryClient.invalidateQueries({ queryKey: [Query.COACH_APPLICATION] })
      }
      if (variables.applicationType === ApplicationType.TUTOR) {
        queryClient.invalidateQueries({ queryKey: [Query.TUTOR_APPLICATION] })
      }
    },
  })

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize

    const applications: Application[] = []
    if (filters.applicationType.includes(ApplicationType.DEVELOPER)) {
      applications.push(...developerApplications)
    }
    if (filters.applicationType.includes(ApplicationType.COACH)) {
      applications.push(...coachApplications)
    }
    if (filters.applicationType.includes(ApplicationType.TUTOR)) {
      applications.push(...tutorApplications)
    }

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
            filters.status.length === 0 ||
            filters.status.includes(application.assessment?.status ?? 'NOT_ASSESSED'),
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
    if (from > filteredSortedData.length) {
      setTablePage(1)
    }

    if (selectedApplicationToView) {
      setSelectedApplicationToView(
        applications.filter((ca) => ca.id === selectedApplicationToView.id).at(0),
      )
    }
  }, [
    developerApplications,
    coachApplications,
    tutorApplications,
    tablePageSize,
    tablePage,
    searchQuery,
    filters,
    sortStatus,
    selectedApplicationToView,
  ])

  return (
    <Stack>
      {selectedApplicationToView?.type === 'developer' && (
        <Modal
          centered
          opened={!!selectedApplicationToView}
          onClose={() => {
            setSelectedApplicationToView(undefined)
          }}
          size='80%'
        >
          <div style={{ padding: '3vh 3vw' }}>
            <DeveloperApplicationForm
              accessMode={ApplicationFormAccessMode.INSTRUCTOR}
              developerApplication={selectedApplicationToView}
              onSuccess={() => {
                setSelectedApplicationToView(undefined)
              }}
            />
          </div>
        </Modal>
      )}
      {selectedApplicationToView?.type === 'coach' && (
        <Modal
          centered
          opened={!!selectedApplicationToView}
          onClose={() => {
            setSelectedApplicationToView(undefined)
          }}
          size='80%'
        >
          <div style={{ padding: '3vh 3vw' }}>
            <CoachApplicationForm
              accessMode={ApplicationFormAccessMode.INSTRUCTOR}
              coachApplication={selectedApplicationToView}
              onSuccess={() => {
                setSelectedApplicationToView(undefined)
              }}
            />
          </div>
        </Modal>
      )}
      {selectedApplicationToView?.type === 'tutor' && (
        <Modal
          centered
          opened={!!selectedApplicationToView}
          onClose={() => {
            setSelectedApplicationToView(undefined)
          }}
          size='80%'
        >
          <div style={{ padding: '3vh 3vw' }}>
            <TutorApplicationForm
              accessMode={ApplicationFormAccessMode.INSTRUCTOR}
              tutorApplication={selectedApplicationToView}
              onSuccess={() => {
                setSelectedApplicationToView(undefined)
              }}
            />
          </div>
        </Modal>
      )}
      {selectedApplicationToDelete && (
        <ConfirmationModal
          title={`Delete Developer Application`}
          text={`Are You sure You want to delete the developer application submitted by student ${
            selectedApplicationToDelete.student.firstName ?? ''
          } ${selectedApplicationToDelete.student.lastName ?? ''}?`}
          opened={!!selectedApplicationToDelete}
          onClose={() => {
            setSelectedApplicationToDelete(undefined)
          }}
          onConfirm={() => {
            removeApplication.mutate({
              applicationType: ApplicationType.DEVELOPER,
              applicationId: selectedApplicationToDelete?.id ?? '',
            })
            setBulkDeleteConfirmationOpened(false)
          }}
        />
      )}
      <ConfirmationModal
        title='Delete Selected Developer Applications'
        text={`Are You sure You want to delete the ${selectedTableRecords.length} selected developer applications?`}
        opened={bulkDeleteConfirmationOpened}
        onClose={() => {
          setBulkDeleteConfirmationOpened(false)
        }}
        onConfirm={() => {
          selectedTableRecords.forEach((applicationToDelete) => {
            removeApplication.mutate({
              applicationType: ApplicationType.DEVELOPER,
              applicationId: applicationToDelete.id,
            })
          })
          setSelectedTableRecords([])
          setBulkDeleteConfirmationOpened(false)
        }}
      />
      <CSVLink
        data={selectedTableRecords?.map((da) => {
          return {
            firstName: da.student.firstName,
            lastName: da.student.lastName,
            tumId: da.student.tumId,
            matriculationNumber: da.student.matriculationNumber,
            email: da.student.email,
            assessmentScore: da.assessment?.assessmentScore,
          }
        })}
        filename='data.csv'
        style={{ display: 'hidden' }}
        ref={downloadLinkRef}
        target='_blank'
      />
      <DataTable
        fetching={isLoading}
        withTableBorder
        minHeight={200}
        noRecordsText='No records to show'
        borderRadius='sm'
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
        onRowContextMenu={({ event }) => {
          showContextMenu([
            {
              key: 'download',
              title: 'Download selected items',
              icon: <IconDownload />,
              color: 'blue',
              onClick: () => {
                downloadLinkRef.current?.link?.click()
              },
            },
            {
              key: 'delete',
              title: `Delete selected items`,
              icon: <IconTrash />,
              color: 'red',
              onClick: () => {
                setBulkDeleteConfirmationOpened(true)
              },
            },
          ])(event)
        }}
        columns={[
          {
            accessor: 'type',
            textAlign: 'center',
            filter: (
              <MultiSelect
                label='Type'
                description='Show all applications with these types'
                data={[
                  {
                    label: 'Developer',
                    value: ApplicationType.DEVELOPER,
                  },
                  { label: 'Coach', value: ApplicationType.COACH },
                  { label: 'Tutor', value: ApplicationType.TUTOR },
                ]}
                value={filters.applicationType}
                placeholder='Search types...'
                onChange={(value) => {
                  setFilters({
                    ...filters,
                    applicationType: value as ApplicationType[],
                  })
                }}
                leftSection={<IconSearch size={16} />}
                clearable
                searchable
              />
            ),
            filtering: filters.applicationType.length > 0,
            render: ({ type }) => {
              return `${type.charAt(0)}${type.toLowerCase().slice(1)}`
            },
          },
          {
            accessor: 'assessment.status',
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
            filtering: filters.applicationType.length > 0,
            render: (application) => {
              let color: string = 'gray'
              switch (application.assessment?.status) {
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
              return (
                <Badge color={color}>
                  {ApplicationStatus[application.assessment?.status]}{' '}
                  {`${
                    application.assessment?.technicalChallengeProgrammingScore
                      ? `${application.assessment?.technicalChallengeProgrammingScore} %`
                      : ''
                  } ${
                    application.assessment?.technicalChallengeProgrammingScore &&
                    application.assessment?.technicalChallengeQuizScore
                      ? '/'
                      : ''
                  } ${
                    application.assessment?.technicalChallengeQuizScore
                      ? `${application.assessment?.technicalChallengeQuizScore} %`
                      : ''
                  }`}
                </Badge>
              )
            },
          },
          {
            accessor: 'assessment.assessmentScore',
            title: 'Score',
            textAlign: 'center',
            sortable: true,
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
            render: (developerApplication) =>
              `${developerApplication.student.firstName ?? ''} ${
                developerApplication.student.lastName ?? ''
              }`,
          },
          {
            accessor: 'actions',
            title: 'Actions',
            textAlign: 'right',
            render: (application) => (
              <Group gap={4} justify='flex-end' wrap='nowrap'>
                <ActionIcon
                  variant='transparent'
                  color='blue'
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    setSelectedApplicationToView(application)
                  }}
                >
                  <IconEyeEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  variant='transparent'
                  color='red'
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    setSelectedApplicationToDelete(application)
                  }}
                >
                  <IconTrash size={16} />
                </ActionIcon>
              </Group>
            ),
          },
        ]}
        onRowClick={({ record }) => {
          setSelectedApplicationToView(record)
        }}
      />
    </Stack>
  )
}
