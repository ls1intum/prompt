import { DataTable } from 'mantine-datatable'
import { type TutorApplication } from '../../../redux/applicationsSlice/applicationsSlice'
import { ActionIcon, Badge, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { ApplicationFormAccessMode } from '../../../forms/DefaultApplicationForm'
import { TutorApplicationForm } from '../../../forms/TutorApplicationForm'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../redux/store'
import { DeletionConfirmationModal } from '../../../utilities/DeletionConfirmationModal'
import { deleteTutorApplication } from '../../../redux/applicationsSlice/thunks/deleteTutorApplications'

interface TutorApplicationTableProps {
  tutorApplications: TutorApplication[]
  searchQuery: string
  filterOnlyNotAssessed: boolean
}

export const TutorApplicationTable = ({
  tutorApplications,
  searchQuery,
  filterOnlyNotAssessed,
}: TutorApplicationTableProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [tablePage, setTablePage] = useState(1)
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tableRecords, setTableRecords] = useState<TutorApplication[]>([])
  const [selectedTableRecords, setSelectedTableRecords] = useState<TutorApplication[]>([])
  const [selectedApplicationToView, setSelectedApplicationToView] = useState<
    TutorApplication | undefined
  >(undefined)
  const [selectedApplicationToDelete, setSelectedApplicationToDelete] = useState<
    TutorApplication | undefined
  >(undefined)
  const [bulkDeleteConfirmationOpened, setBulkDeleteConfirmationOpened] = useState(false)

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize

    setTableRecords(
      tutorApplications
        .filter(({ student }) => {
          return `${student.firstName ?? ''} ${student.lastName ?? ''} ${student.tumId ?? ''} ${
            student.matriculationNumber ?? ''
          }`.includes(searchQuery)
        })
        .filter((studentApplication) =>
          filterOnlyNotAssessed ? !studentApplication.assessment?.assessed : true,
        )
        .slice(from, to),
    )
  }, [tutorApplications, tablePageSize, tablePage, searchQuery, filterOnlyNotAssessed])

  return (
    <Stack>
      <Modal
        opened={!!selectedApplicationToView}
        onClose={() => {
          setSelectedApplicationToView(undefined)
        }}
        size='xl'
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
            void dispatch(deleteTutorApplication(selectedApplicationToDelete.id))
          }}
        />
      )}
      <DeletionConfirmationModal
        title='Delete Selected Tutor Applications'
        text={`Are You sure You want to delete the ${selectedTableRecords.length} selected tutor applications?`}
        opened={bulkDeleteConfirmationOpened}
        onClose={() => {
          setBulkDeleteConfirmationOpened(false)
        }}
        onConfirm={() => {
          selectedTableRecords.forEach((applicationToDelete) => {
            void dispatch(deleteTutorApplication(applicationToDelete.id))
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
        records={tableRecords}
        selectedRecords={selectedTableRecords}
        onSelectedRecordsChange={setSelectedTableRecords}
        columns={[
          {
            accessor: 'applicationStatus',
            title: <Text>Application Status</Text>,
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
            render: (application) => (
              <Group spacing={4} position='right' noWrap>
                <ActionIcon
                  color='blue'
                  onClick={(e: React.MouseEvent) => {
                    e.stopPropagation()
                    setSelectedApplicationToView(application)
                  }}
                >
                  <IconEdit size={16} />
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
        /* onRowClick={({ firstName }: StudentApplication) => {
    alert(`You clicked on ${firstName}`)
  }} */
      />
      <Button
        leftIcon={<IconTrash />}
        disabled={selectedTableRecords.length === 0}
        onClick={() => {
          setBulkDeleteConfirmationOpened(true)
        }}
      >
        Delete
      </Button>
    </Stack>
  )
}
