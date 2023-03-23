import { Group, Text, Stack, ActionIcon } from '@mantine/core'
import { IconEdit, IconTrash } from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'
import { useState, useEffect } from 'react'
import {
  type StudentApplication,
  fetchStudentApplications,
} from '../../service/studentApplicationService'
import { StudentApplicationModal } from './StudentApplicationModal'

export const StudentApplicationOverview = (): JSX.Element => {
  const [studentApplicationModalOpen, setStudentApplicationModalOpen] = useState<
    StudentApplication | undefined
  >(undefined)
  const [studentApplications, setApplications] = useState<[StudentApplication] | undefined>()

  useEffect(() => {
    void (async () => {
      const response = await fetchStudentApplications()
      setApplications(response)
    })()
  }, [])

  return (
    <div style={{ marginInline: '10vw', marginTop: '5vh' }}>
      {studentApplicationModalOpen && (
        <StudentApplicationModal
          open={!!studentApplicationModalOpen}
          onClose={() => {
            setStudentApplicationModalOpen(undefined)
          }}
          studentApplication={studentApplicationModalOpen}
        />
      )}
      <DataTable
        withBorder
        minHeight={150}
        noRecordsText='No records to show'
        borderRadius='sm'
        withColumnBorders
        verticalSpacing='md'
        striped
        highlightOnHover
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
        records={studentApplications}
        columns={[
          {
            accessor: 'student.tumId',
            title: 'TUM ID',
            textAlignment: 'right',
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
