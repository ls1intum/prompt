import { DataTable, type DataTableSortStatus } from 'mantine-datatable'
import sortBy from 'lodash/sortBy'
import { CSVLink } from 'react-csv'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Gender, type Application } from '../../../redux/applicationsSlice/applicationsSlice'
import { ActionIcon, Badge, Group, Modal, MultiSelect, Stack, Text } from '@mantine/core'
import { IconDownload, IconEyeEdit, IconSearch, IconTrash } from '@tabler/icons-react'
import { useEffect, useRef, useState } from 'react'
import { DeveloperApplicationForm } from '../../../forms/DeveloperApplicationForm'
import { ApplicationFormAccessMode } from '../../../forms/DefaultApplicationForm'
import { DeletionConfirmationModal } from '../../../utilities/DeletionConfirmationModal'
import { useDispatch } from 'react-redux'
import { useAppSelector, type AppDispatch } from '../../../redux/store'
import { deleteDeveloperApplication } from '../../../redux/applicationsSlice/thunks/deleteApplication'
import { type Filters } from '../ApplicationOverview'
import { CoachApplicationForm } from '../../../forms/CoachApplicationForm'
import { TutorApplicationForm } from '../../../forms/TutorApplicationForm'

interface ApplicationDatatableProps {
  applications: Application[]
  searchQuery: string
  filters: Filters
  setFilters: (filters: Filters) => void
}

export const ApplicationDatatable = ({
  applications,
  searchQuery,
  filters,
  setFilters,
}: ApplicationDatatableProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const loadingStatus = useAppSelector((state) => state.applications.status)
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
  const downloadLinkRef = useRef<HTMLAnchorElement & { link: HTMLAnchorElement }>(null)
  const [tablePage, setTablePage] = useState(1)
  const [totalDisplayedRecords, setTotalDisplayedRecords] = useState(applications.length)
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tableRecords, setTableRecords] = useState<Application[]>([])
  const [selectedTableRecords, setSelectedTableRecords] = useState<Application[]>([])
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
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

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize

    const filteredSortedData = sortBy(
      applications
        .filter(({ type }) => filters.applicationType.some((selectedType) => selectedType === type))
        .filter(({ student }) => {
          return `${student.firstName ?? ''} ${student.lastName ?? ''} ${student.tumId ?? ''} ${
            student.matriculationNumber ?? ''
          }`
            .toLowerCase()
            .includes(searchQuery.toLowerCase())
        })
        .filter((application) => (filters.accepted ? application.assessment?.accepted : true))
        .filter((application) =>
          filters.rejected
            ? application.assessment?.accepted !== null && !application.assessment?.accepted
            : true,
        )
        .filter((application) =>
          filters.notAssessed ? application.assessment?.accepted === null : true,
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
  }, [applications, tablePageSize, tablePage, searchQuery, filters, sortStatus])

  return (
    <Stack>
      {selectedApplicationToView?.type === 'DEVELOPER' && (
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
      {selectedApplicationToView?.type === 'COACH' && (
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
      {selectedApplicationToView?.type === 'TUTOR' && (
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
        <DeletionConfirmationModal
          title={`Delete Developer Application`}
          text={`Are You sure You want to delete the developer application submitted by student ${
            selectedApplicationToDelete.student.firstName ?? ''
          } ${selectedApplicationToDelete.student.lastName ?? ''}?`}
          opened={!!selectedApplicationToDelete}
          onClose={() => {
            setSelectedApplicationToDelete(undefined)
          }}
          onConfirm={() => {
            void dispatch(deleteDeveloperApplication(selectedApplicationToDelete.id))
            setBulkDeleteConfirmationOpened(false)
          }}
        />
      )}
      <DeletionConfirmationModal
        title='Delete Selected Developer Applications'
        text={`Are You sure You want to delete the ${selectedTableRecords.length} selected developer applications?`}
        opened={bulkDeleteConfirmationOpened}
        onClose={() => {
          setBulkDeleteConfirmationOpened(false)
        }}
        onConfirm={() => {
          selectedTableRecords.forEach((applicationToDelete) => {
            void dispatch(deleteDeveloperApplication(applicationToDelete.id))
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
            matriculationNumber: da.student.matriculationNumber,
            assessmentScore: da.assessment?.assessmentScore,
          }
        })}
        filename='data.csv'
        style={{ display: 'hidden' }}
        ref={downloadLinkRef}
        target='_blank'
      />
      <DataTable
        fetching={loadingStatus === 'loading'}
        withBorder
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
        /* rowExpansion={{
          allowMultiple: true,
          collapseProps: {
            transitionDuration: 500,
            animateOpacity: false,
            transitionTimingFunction: 'ease-out',
          },
          content: ({ record }) => (
            <Stack p='xs' spacing={6}>
              <Group spacing={6}>
                <Text fw={700}>
                  {record.student.firstName} {record.student.lastName}: {record.student.tumId}
                </Text>
              </Group>
              <Group>
                <Text fw={700}>Assessment Score:</Text>
                <Text c='dimmed'>
                  {record.assessment?.assessmentScore ?? 'No assessment score assigned yet.'}
                </Text>
              </Group>
              <Group style={{ display: 'flex', alignItems: 'flex-start' }}>
                <Text fw={700}>Comments:</Text>
                <Stack>
                  {record.assessment?.instructorComments.map((comment, idx) => (
                    <Group
                      key={`${comment.id ?? ''}-${idx}`}
                      style={{ display: 'flex', alignItems: 'flex-start' }}
                    >
                      <Text fw={700}>{comment.author}</Text>
                      <Text c='dimmed'>{`${comment.text}`}</Text>
                    </Group>
                  ))}
                </Stack>
              </Group>
            </Stack>
          ),
        }} */
        records={tableRecords}
        selectedRecords={selectedTableRecords}
        onSelectedRecordsChange={setSelectedTableRecords}
        rowContextMenu={{
          items: () => [
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
          ],
        }}
        columns={[
          {
            accessor: 'type',
            textAlignment: 'center',
            filter: (
              <MultiSelect
                label='Type'
                description='Show all applications with these types'
                data={[
                  {
                    label: 'Developer',
                    value: 'DEVELOPER',
                  },
                  { label: 'Coach', value: 'COACH' },
                  { label: 'Tutor', value: 'TUTOR' },
                ]}
                value={filters.applicationType}
                placeholder='Search types...'
                onChange={(value) => {
                  setFilters({
                    ...filters,
                    applicationType: value,
                  })
                }}
                icon={<IconSearch size={16} />}
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
            accessor: 'applicationStatus',
            title: 'Status',
            textAlignment: 'center',
            render: (application) => {
              const isAccepted = application.assessment?.accepted ?? false
              const isAssessed =
                application.assessment?.accepted !== undefined &&
                application.assessment?.accepted !== null
              return (
                <Badge color={!isAssessed ? 'gray' : isAccepted ? 'green' : 'red'}>
                  {!isAssessed ? 'Not Assessed' : isAccepted ? 'Accepted' : 'Rejected'}{' '}
                  {`${
                    application.assessment?.technicalChallengeProgrammingScore
                      ? `${application.assessment?.technicalChallengeProgrammingScore} %`
                      : ''
                  } ${
                    application.assessment?.technicalChallengeProgrammingScore &&
                    application.assessment.technicalChallengeQuizScore
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
            textAlignment: 'center',
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
            title: <Text mr='xs'>Actions</Text>,
            textAlignment: 'right',
            render: (application) => (
              <Group spacing={4} position='right' noWrap>
                <ActionIcon
                  color='blue'
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    setSelectedApplicationToView(application)
                  }}
                >
                  <IconEyeEdit size={16} />
                </ActionIcon>
                <ActionIcon
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
        onRowClick={(application) => {
          setSelectedApplicationToView(application)
        }}
      />
    </Stack>
  )
}
