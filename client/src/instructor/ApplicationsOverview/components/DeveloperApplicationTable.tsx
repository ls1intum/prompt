import { DataTable } from 'mantine-datatable'
import {
  Gender,
  type DeveloperApplication,
} from '../../../redux/applicationsSlice/applicationsSlice'
import { ActionIcon, Badge, Button, Group, Modal, Stack, Text } from '@mantine/core'
import { IconEyeEdit, IconTrash } from '@tabler/icons-react'
import { useEffect, useState } from 'react'
import { DeveloperApplicationForm } from '../../../forms/DeveloperApplicationForm'
import { ApplicationFormAccessMode } from '../../../forms/DefaultApplicationForm'
import { DeletionConfirmationModal } from '../../../utilities/DeletionConfirmationModal'
import { useDispatch } from 'react-redux'
import { type AppDispatch } from '../../../redux/store'
import { deleteDeveloperApplication } from '../../../redux/applicationsSlice/thunks/deleteApplication'
import { type Filters } from '../ApplicationOverview'

interface DeveloperApplicationTableProps {
  developerApplications: DeveloperApplication[]
  searchQuery: string
  filters: Filters
}

export const DeveloperApplicationTable = ({
  developerApplications,
  searchQuery,
  filters,
}: DeveloperApplicationTableProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const [tablePage, setTablePage] = useState(1)
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tableRecords, setTableRecords] = useState<DeveloperApplication[]>([])
  const [selectedTableRecords, setSelectedTableRecords] = useState<DeveloperApplication[]>([])
  const [selectedApplicationToView, setSelectedApplicationToView] = useState<
    DeveloperApplication | undefined
  >(undefined)
  const [selectedApplicationToDelete, setSelectedApplicationToDelete] = useState<
    DeveloperApplication | undefined
  >(undefined)
  const [bulkDeleteConfirmationOpened, setBulkDeleteConfirmationOpened] = useState(false)

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize
    console.log(developerApplications.map((d) => d.student.gender))
    console.log(Gender.FEMALE)

    setTableRecords(
      developerApplications
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
          filters.female ? application.student.gender === Gender.FEMALE : true,
        )
        .filter((application) => (filters.male ? application.student.gender === Gender.MALE : true))
        .slice(from, to),
    )

    if (selectedApplicationToView) {
      setSelectedApplicationToView(
        developerApplications.filter((ca) => ca.id === selectedApplicationToView.id).at(0),
      )
    }
  }, [developerApplications, tablePageSize, tablePage, searchQuery, filters])

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
          <DeveloperApplicationForm
            accessMode={ApplicationFormAccessMode.INSTRUCTOR}
            developerApplication={selectedApplicationToView}
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
        recordsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40, 50, 100, 200, 300]}
        onRecordsPerPageChange={(pageSize) => {
          setTablePageSize(pageSize)
        }}
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
        columns={[
          {
            accessor: 'applicationStatus',
            title: 'Application Status',
            textAlignment: 'center',
            render: (studentApplication) => {
              const isAccepted = studentApplication.assessment?.accepted
              const isAssessed = studentApplication.assessment?.assessed
              return (
                <Badge
                  color={
                    !isAssessed
                      ? 'gray'
                      : isAccepted
                      ? 'green'
                      : isAccepted === null
                      ? 'gray'
                      : 'red'
                  }
                >
                  {!isAssessed
                    ? 'Not Assessed'
                    : isAccepted
                    ? 'Accepted'
                    : isAccepted === null
                    ? 'Pending'
                    : 'Rejected'}
                </Badge>
              )
            },
          },
          {
            accessor: 'assessment.assessmentScore',
            title: 'Score',
            textAlignment: 'center',
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
          {
            accessor: 'fullName',
            title: 'Full name',
            render: (developerApplication) => {
              return (
                <Text>{`${developerApplication.student.firstName ?? ''} ${
                  developerApplication.student.lastName ?? ''
                }`}</Text>
              )
            },
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
