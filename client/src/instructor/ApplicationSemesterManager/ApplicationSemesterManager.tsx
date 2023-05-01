import { ActionIcon, Button, Group, Text, Tooltip } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import { useEffect, useState } from 'react'
import { type ApplicationSemester } from '../../redux/applicationSemesterSlice/applicationSemesterSlice'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import { ApplicationSemesterCreationModal } from './WorkspaceSelectionDialog'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { deleteApplicationSemester } from '../../redux/applicationSemesterSlice/thunks/deleteApplicationSemester'

export const ApplicationSemesterManager = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const applicationSemesters = useAppSelector(
    (state) => state.applicationSemester.applicationSemesters,
  )
  const [tableRecords, setTableRecords] = useState<ApplicationSemester[]>([])
  const [tablePageSize, setTablePageSize] = useState(15)
  const [tablePage, setTablePage] = useState(1)
  const [creationModalOpen, setCreationModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedApplicationSemester, setSelectedApplicationSemester] = useState<
    ApplicationSemester | undefined
  >(undefined)

  useEffect(() => {
    setTableRecords(applicationSemesters)
  }, [applicationSemesters])

  return (
    <div>
      <ApplicationSemesterCreationModal
        opened={creationModalOpen}
        onClose={() => {
          setCreationModalOpen(false)
        }}
      />
      {selectedApplicationSemester && (
        <ApplicationSemesterCreationModal
          opened={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
          }}
          applicationSemester={selectedApplicationSemester}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'right', margin: '2vh 0' }}>
        <Button
          leftIcon={<IconPlus />}
          variant='filled'
          onClick={() => {
            setCreationModalOpen(true)
          }}
        >
          Create Application Semester
        </Button>
      </div>
      <DataTable
        withBorder
        minHeight={150}
        noRecordsText='No records to show'
        borderRadius='sm'
        withColumnBorders
        verticalSpacing='md'
        striped
        highlightOnHover
        records={tableRecords}
        totalRecords={applicationSemesters.length}
        recordsPerPage={tablePageSize}
        page={tablePage}
        onPageChange={(page) => {
          setTablePage(page)
        }}
        recordsPerPageOptions={[10, 15, 20, 25, 30, 35, 40]}
        onRecordsPerPageChange={(pageSize) => {
          setTablePageSize(pageSize)
        }}
        columns={[
          {
            accessor: 'semesterName',
            title: 'Application Semester Name',
          },
          {
            accessor: 'iosTag',
            title: 'iOS Tag',
          },
          {
            accessor: 'applicationPeriodStart',
            title: 'Application Period Start',
            render: (applicationSemester) => (
              <Text>
                {moment(applicationSemester.applicationPeriodStart).format('DD. MMMM YYYY')}
              </Text>
            ),
          },
          {
            accessor: 'applicationPeriodEnd',
            title: 'Application Period End',
            render: (applicationSemester) => (
              <Text>
                {moment(applicationSemester.applicationPeriodEnd).format('DD. MMMM YYYY')}
              </Text>
            ),
          },
          {
            accessor: 'actions',
            title: <Text mr='xs'>Actions</Text>,
            textAlignment: 'right',
            render: (applicationSemester) => (
              <Group spacing={4} position='right' noWrap>
                <Tooltip label='Edit application semester'>
                  <ActionIcon
                    color='blue'
                    onClick={(e: React.MouseEvent) => {
                      setSelectedApplicationSemester(applicationSemester)
                      setEditModalOpen(true)
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label='Delete application semester'>
                  <ActionIcon
                    color='red'
                    onClick={() => {
                      void dispatch(deleteApplicationSemester(applicationSemester.id.toString()))
                    }}
                  >
                    <IconTrash size={16} />
                  </ActionIcon>
                </Tooltip>
              </Group>
            ),
          },
        ]}
      />
    </div>
  )
}
