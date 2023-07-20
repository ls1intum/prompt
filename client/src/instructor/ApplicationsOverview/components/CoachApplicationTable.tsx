import { DataTable, type DataTableSortStatus } from 'mantine-datatable'
import sortBy from 'lodash/sortBy'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { Gender, type CoachApplication } from '../../../redux/applicationsSlice/applicationsSlice'
import { ActionIcon, Badge, Group, Modal, Stack, Text } from '@mantine/core'
import { IconEyeEdit, IconTrash } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { ApplicationFormAccessMode } from '../../../forms/DefaultApplicationForm'
import { CoachApplicationForm } from '../../../forms/CoachApplicationForm'
import { DeletionConfirmationModal } from '../../../utilities/DeletionConfirmationModal'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../redux/store'
import { deleteCoachApplication } from '../../../redux/applicationsSlice/thunks/deleteApplication'
import { type Filters } from '../ApplicationOverview'

interface CoachApplicationTableProps {
  coachApplications: CoachApplication[]
  searchQuery: string
  filters: Filters
}

export const CoachApplicationTable = ({
  coachApplications,
  searchQuery,
  filters,
}: CoachApplicationTableProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
  const [tablePage, setTablePage] = useState(1)
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tableRecords, setTableRecords] = useState<CoachApplication[]>([])
  const [selectedTableRecords, setSelectedTableRecords] = useState<CoachApplication[]>([])
  const [sortStatus, setSortStatus] = useState<DataTableSortStatus>({
    columnAccessor: 'fullName',
    direction: 'asc',
  })
  const [selectedApplicationToView, setSelectedApplicationToView] = useState<
    CoachApplication | undefined
  >(undefined)
  const [selectedApplicationToDelete, setSelectedApplicationToDelete] = useState<
    CoachApplication | undefined
  >(undefined)
  const [bulkDeleteConfirmationOpened, setBulkDeleteConfirmationOpened] = useState(false)

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize

    const filteredSortedData = sortBy(
      coachApplications
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
            ? application.assessment?.assessed && !application.assessment.accepted
            : true,
        )
        .filter((application) => (filters.notAssessed ? !application.assessment?.assessed : true))
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
    ).slice(from, to)

    setTableRecords(
      sortStatus.direction === 'desc' ? filteredSortedData.reverse() : filteredSortedData,
    )

    if (selectedApplicationToView) {
      setSelectedApplicationToView(
        coachApplications.filter((ca) => ca.id === selectedApplicationToView.id).at(0),
      )
    }
  }, [coachApplications, tablePageSize, tablePage, searchQuery, filters, sortStatus])

  return (
    <Stack>
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
            void dispatch(deleteCoachApplication(selectedApplicationToDelete.id))
          }}
        />
      )}
      <DeletionConfirmationModal
        title='Delete Selected Coach Applications'
        text={`Are You sure You want to delete the ${selectedTableRecords.length} selected coach applications?`}
        opened={bulkDeleteConfirmationOpened}
        onClose={() => {
          setBulkDeleteConfirmationOpened(false)
        }}
        onConfirm={() => {
          selectedTableRecords.forEach((applicationToDelete) => {
            void dispatch(deleteCoachApplication(applicationToDelete.id))
          })
          setSelectedTableRecords([])
          setBulkDeleteConfirmationOpened(false)
        }}
      />
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
        }} */
        records={tableRecords}
        selectedRecords={selectedTableRecords}
        onSelectedRecordsChange={setSelectedTableRecords}
        rowContextMenu={{
          items: () => [
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
            accessor: 'applicationStatus',
            title: 'Application Status',
            textAlignment: 'center',
            render: (studentApplication) => {
              const isAccepted = studentApplication.assessment?.accepted
              const isAssessed = studentApplication.assessment?.assessed
              return (
                <Badge color={isAccepted ? 'green' : isAssessed ? 'red' : 'gray'}>
                  {isAccepted ? 'Accepted' : isAssessed ? 'Rejected' : 'Not Assessed'}
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
            render: (coachApplication) =>
              `${coachApplication.student.firstName ?? ''} ${
                coachApplication.student.lastName ?? ''
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
