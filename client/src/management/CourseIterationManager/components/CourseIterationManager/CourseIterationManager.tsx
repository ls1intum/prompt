import { ActionIcon, Button, Group, Text, Tooltip } from '@mantine/core'
import { DataTable } from 'mantine-datatable'
import { useEffect, useState } from 'react'
import { IconEdit, IconPlus, IconTrash } from '@tabler/icons-react'
import moment from 'moment'
import { CourseIterationCreationModal } from './WorkspaceSelectionDialog'
import { useCourseIterationStore } from '../../../../state/zustand/useCourseIterationStore'
import { CourseIteration } from '../../../../interface/courseIteration'
import { deleteCourseIteration } from '../../../../network/courseIteration'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Query } from '../../../../state/query'
import { ConfirmationModal } from '../../../../utilities/ConfirmationModal'

export const CourseIterationManager = (): JSX.Element => {
  const queryClient = useQueryClient()
  const { courseIterations } = useCourseIterationStore()
  const [tableRecords, setTableRecords] = useState<CourseIteration[]>([])
  const [tablePageSize, setTablePageSize] = useState(15)
  const [tablePage, setTablePage] = useState(1)
  const [creationModalOpen, setCreationModalOpen] = useState(false)
  const [editModalOpen, setEditModalOpen] = useState(false)
  const [deleteModalOpen, setDeleteModalOpen] = useState(false)
  const [selectedCourseIteration, setSelectedCourseIteration] = useState<
    CourseIteration | undefined
  >(undefined)

  const removeCourseIteration = useMutation({
    mutationFn: (courseIterationId: string) => {
      return deleteCourseIteration(courseIterationId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.COURSE_ITERATION] })
    },
  })

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
            setSelectedCourseIteration(undefined)
          }}
          courseIteration={selectedCourseIteration}
        />
      )}
      {selectedCourseIteration && (
        <ConfirmationModal
          opened={deleteModalOpen}
          onClose={() => {
            setDeleteModalOpen(false)
            setSelectedCourseIteration(undefined)
          }}
          onConfirm={() => {
            removeCourseIteration.mutate(selectedCourseIteration.id)
            setDeleteModalOpen(false)
          }}
          title={'Delete Course Iteration'}
          text={`Are You sure You want to permanetly delete the course iteration ${selectedCourseIteration.semesterName} ?`}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'right', margin: '2vh 0' }}>
        <Button
          leftSection={<IconPlus />}
          variant='filled'
          onClick={() => {
            setCreationModalOpen(true)
          }}
        >
          Create Course Iteration
        </Button>
      </div>
      <DataTable
        withTableBorder
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
        onRowClick={({ record: courseIteration }) => {
          setSelectedCourseIteration(courseIteration)
          setEditModalOpen(true)
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
              <Text fz='sm'>
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
              <Text fz='sm'>
                {`${moment(courseIteration.coachApplicationPeriodStart).format('DD. MMMM YYYY')} -
                ${moment(courseIteration.coachApplicationPeriodEnd).format('DD. MMMM YYYY')}`}
              </Text>
            ),
          },
          {
            accessor: 'tutorApplicationPeriod',
            title: ' Tutor Application Period',
            render: (courseIteration) => (
              <Text fz='sm'>
                {`${moment(courseIteration.tutorApplicationPeriodStart).format('DD. MMMM YYYY')} - 
                ${moment(courseIteration.tutorApplicationPeriodEnd).format('DD. MMMM YYYY')}`}
              </Text>
            ),
          },
          {
            accessor: 'introCourse',
            title: 'Intro Course',
            render: (courseIteration) => (
              <Text fz='sm'>
                {`${moment(courseIteration.introCourseStart).format('DD. MMMM YYYY')} - 
                ${moment(courseIteration.introCourseEnd).format('DD. MMMM YYYY')}`}
              </Text>
            ),
          },
          {
            accessor: 'actions',
            title: 'Actions',
            textAlign: 'right',
            render: (courseIteration) => (
              <Group gap={4} justify='flex-end' wrap='nowrap'>
                <Tooltip label='Edit course iteration'>
                  <ActionIcon
                    variant='transparent'
                    color='blue'
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCourseIteration(courseIteration)
                      setEditModalOpen(true)
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label='Delete course iteration'>
                  <ActionIcon
                    variant='transparent'
                    color='red'
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedCourseIteration(courseIteration)
                      setDeleteModalOpen(true)
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
