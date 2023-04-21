import { Group, Text, Stack, ActionIcon, TextInput, Badge, Checkbox } from '@mantine/core'
import { IconEdit, IconSearch, IconTrash } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'
import { useState, useEffect } from 'react'
import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../../redux/store'
import { type StudentApplication } from '../../redux/studentApplicationSlice/studentApplicationSlice'
import { fetchStudentApplications } from '../../redux/studentApplicationSlice/thunks/fetchStudentApplications'
import { StudentApplicationModal } from './StudentApplicationModal'

export const StudentApplicationOverview = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const studentApplications = useAppSelector(
    (state) => state.studentApplications.studentApplications,
  )
  const selectedApplicationSemester = useAppSelector(
    (state) => state.applicationSemester.currentState,
  )
  const [studentApplicationModalOpen, setStudentApplicationModalOpen] = useState<
    StudentApplication | undefined
  >(undefined)
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tablePage, setTablePage] = useState(1)
  const [tableRecords, setTableRecords] = useState<StudentApplication[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [showOnlyNotAssessed, setShowOnlyNotAssessed] = useState(false)

  useEffect(() => {
    if (selectedApplicationSemester) {
      void dispatch(fetchStudentApplications(selectedApplicationSemester.semesterName))
    }
  }, [selectedApplicationSemester])

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize

    setTableRecords(
      studentApplications
        .filter(({ student }) => {
          return `${student.firstName ?? ''} ${student.lastName} ${student.email} ${
            student.tumId
          } ${student.matriculationNumber}`.includes(searchQuery)
        })
        .filter((studentApplication) => (showOnlyNotAssessed ? !studentApplication.assessed : true))
        .slice(from, to),
    )
  }, [studentApplications, tablePageSize, tablePage, searchQuery, showOnlyNotAssessed])

  return (
    <div>
      {studentApplicationModalOpen && (
        <StudentApplicationModal
          open={!!studentApplicationModalOpen}
          onClose={() => {
            setStudentApplicationModalOpen(undefined)
          }}
          studentApplication={studentApplicationModalOpen}
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
        <Checkbox
          label='Show only not assessed'
          checked={showOnlyNotAssessed}
          onChange={(e) => {
            setShowOnlyNotAssessed(e.currentTarget.checked)
          }}
        />
      </Group>
      <DataTable
        withBorder
        minHeight={200}
        noRecordsText='No records to show'
        borderRadius='sm'
        withColumnBorders
        verticalSpacing='md'
        striped
        highlightOnHover
        totalRecords={studentApplications.length}
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
        columns={[
          {
            accessor: 'applicationStatus',
            title: <Text>Application Status</Text>,
            render: (studentApplication) => {
              const isAccepted = studentApplication.accepted
              const isAssessed = studentApplication.assessed
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
                    setStudentApplicationModalOpen(studentApplication)
                  }}
                >
                  <IconEdit size={16} />
                </ActionIcon>
                <ActionIcon
                  color='red'
                  onClick={() => {
                    console.log(studentApplication)
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
    </div>
  )
}
