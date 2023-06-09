import { ActionIcon, Button, Group, Text, Tooltip } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import { useEffect, useState } from 'react'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import { deleteCourseIteration } from '../../../../redux/courseIterationSlice/thunks/deleteCourseIteration'
import { type CourseIteration } from '../../../../redux/courseIterationSlice/courseIterationSlice'
import { CourseIterationCreationModal } from './WorkspaceSelectionDialog'

export const CourseIterationManager = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const courseIterations = useAppSelector((state) => state.courseIterations.courseIterations)
  const [tableRecords, setTableRecords] = useState<CourseIteration[]>([])
  const [tablePageSize, setTablePageSize] = useState(15)
  const [tablePage, setTablePage] = useState(1)
  const [creationModalOpen, setCreationModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [selectedCourseIteration, setSelectedCourseIteration] = useState<
    CourseIteration | undefined
  >(undefined)

  useEffect(() => {
    setTableRecords(courseIterations)
  }, [courseIterations])

  return (
    <div>
      <CourseIterationCreationModal
        opened={creationModalOpen}
        onClose={() => {
          setCreationModalOpen(false)
        }}
      />
      {selectedCourseIteration && (
        <CourseIterationCreationModal
          opened={editModalOpen}
          onClose={() => {
            setEditModalOpen(false)
          }}
          courseIteration={selectedCourseIteration}
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
          Create Course Iteration
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
        totalRecords={courseIterations.length}
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
            title: 'Course Iteration Semester Name',
          },
          {
            accessor: 'iosTag',
            title: 'iOS Tag',
          },
          {
            accessor: 'developerApplicationPeriod',
            title: ' Developer Application Period',
            render: (courseIteration) => (
              <Text>
                {`${moment(courseIteration.developerApplicationPeriodStart).format(
                  'DD. MMMM YYYY',
                )} -
                ${moment(courseIteration.developerApplicationPeriodEnd).format('DD. MMMM YYYY')}`}
              </Text>
            ),
          },
          {
            accessor: 'coachApplicationPeriod',
            title: ' Coach Application Period',
            render: (courseIteration) => (
              <Text>
                {`${moment(courseIteration.coachApplicationPeriodStart).format('DD. MMMM YYYY')} -
                ${moment(courseIteration.coachApplicationPeriodEnd).format('DD. MMMM YYYY')}`}
              </Text>
            ),
          },
          {
            accessor: 'tutorApplicationPeriod',
            title: ' Tutor Application Period',
            render: (courseIteration) => (
              <Text>
                {`${moment(courseIteration.tutorApplicationPeriodStart).format('DD. MMMM YYYY')} - 
                ${moment(courseIteration.tutorApplicationPeriodEnd).format('DD. MMMM YYYY')}`}
              </Text>
            ),
          },
          {
            accessor: 'actions',
            title: <Text mr='xs'>Actions</Text>,
            textAlignment: 'right',
            render: (courseIteration) => (
              <Group spacing={4} position='right' noWrap>
                <Tooltip label='Edit course iteration'>
                  <ActionIcon
                    color='blue'
                    onClick={(e: React.MouseEvent) => {
                      setSelectedCourseIteration(courseIteration)
                      setEditModalOpen(true)
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label='Delete course iteration'>
                  <ActionIcon
                    color='red'
                    onClick={() => {
                      void dispatch(deleteCourseIteration(courseIteration.id.toString()))
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
