import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Notification,
  Stack,
  Text,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  IconAlertTriangle,
  IconEdit,
  IconPlus,
  IconSearch,
  IconTrash,
  IconUsers,
} from '@tabler/icons-react'
import { DataTable } from 'mantine-datatable'
import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import {
  type ProjectTeamPatch,
  type ProjectTeam,
} from '../../../../redux/projectTeamsSlice/projectTeamsSlice'
import { createProjectTeam } from '../../../../redux/projectTeamsSlice/thunks/createProjectTeam'
import { deleteProjectTeam } from '../../../../redux/projectTeamsSlice/thunks/deleteProjectTeam'
import { fetchProjectTeams } from '../../../../redux/projectTeamsSlice/thunks/fetchProjectTeams'
import { updateProjectTeam } from '../../../../redux/projectTeamsSlice/thunks/updateProjectTeam'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import { fetchDeveloperApplications } from '../../../../redux/applicationsSlice/thunks/fetchDeveloperApplications'
import { ProjectTeamMemberListModal } from './ProjectTeamMemberListModal'
import { DeletionConfirmationModal } from '../../../../utilities/DeletionConfirmationModal'

interface ProjectTeamCreationModalProps {
  opened: boolean
  onClose: () => void
  projectTeam: ProjectTeam | undefined
}

const ProjectTeamCreationModal = ({
  projectTeam,
  opened,
  onClose,
}: ProjectTeamCreationModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const form = useForm<ProjectTeam>({
    initialValues: projectTeam
      ? { ...projectTeam }
      : {
          id: '',
          name: '',
          customer: '',
        },
  })

  return (
    <Modal opened={opened} onClose={onClose} centered>
      <Stack>
        <TextInput
          withAsterisk
          required
          label='Name'
          placeholder='IOS202XTEAM_NAME'
          {...form.getInputProps('name')}
        />
        <TextInput
          withAsterisk
          required
          label='Customer'
          placeholder='Customer'
          {...form.getInputProps('customer')}
        />
        <Button
          variant='outline'
          type='submit'
          onClick={() => {
            if (selectedCourseIteration) {
              if (projectTeam) {
                const projectTeamPatchObjectArray: ProjectTeamPatch[] = []
                Object.keys(form.values).forEach((key) => {
                  const projectTeamPatchObject = new Map()
                  projectTeamPatchObject.set('op', 'replace')
                  projectTeamPatchObject.set('path', '/' + key)
                  projectTeamPatchObject.set('value', form.getInputProps(key).value)
                  const obj = Object.fromEntries(projectTeamPatchObject)
                  projectTeamPatchObjectArray.push(obj)
                })

                void dispatch(
                  updateProjectTeam({
                    projectTeamId: projectTeam.id,
                    projectTeamPatch: projectTeamPatchObjectArray,
                  }),
                )
              } else {
                void dispatch(
                  createProjectTeam({
                    projectTeam: form.values,
                    courseIteration: selectedCourseIteration.semesterName,
                  }),
                )
              }
              form.reset()
              onClose()
            }
          }}
        >
          Submit
        </Button>
      </Stack>
    </Modal>
  )
}

export const ProjectTeamsManager = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const projectTeams = useAppSelector((state) => state.projectTeams.projectTeams)
  const studentApplications = useAppSelector((state) => state.applications.developerApplications)
  const [projectTeamCreationModalOpen, setProjectTeamCreationModalOpen] = useState(false)
  const [projectTeamEditModalOpen, setProjectTeamEditOpen] = useState(false)
  const [projectTeamMemberListModalOpen, setProjectTeamMemberListModalOpen] = useState(false)
  const [selectedProjectTeam, setSelectedProjectTeam] = useState<ProjectTeam | undefined>()
  const [projectTeamDeletionConfirmationOpen, setProjectTeamDeletionConfirmationOpen] =
    useState(false)
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tablePage, setTablePage] = useState(1)
  const [tableRecords, setTableRecords] = useState<ProjectTeam[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteAttemptNonEmptyProjectTeamShowed, setDeleteAttemptNotEmptyProjectTeamShowed] =
    useState(false)

  useEffect(() => {
    if (selectedCourseIteration) {
      void dispatch(
        fetchDeveloperApplications({ courseIteration: selectedCourseIteration.semesterName }),
      )
      void dispatch(fetchProjectTeams(selectedCourseIteration.semesterName))
    }
  }, [selectedCourseIteration])

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize
    setTableRecords(
      projectTeams
        .filter(({ name, customer }) => {
          return `${name.toLowerCase()} ${customer.toLowerCase()}`.includes(
            searchQuery.toLowerCase(),
          )
        })
        .slice(from, to),
    )
  }, [projectTeams, tablePageSize, tablePage, searchQuery])

  return (
    <>
      <ProjectTeamCreationModal
        opened={projectTeamCreationModalOpen}
        onClose={() => {
          setProjectTeamCreationModalOpen(false)
        }}
        projectTeam={undefined}
      />
      {selectedProjectTeam && (
        <ProjectTeamCreationModal
          opened={projectTeamEditModalOpen}
          onClose={() => {
            setProjectTeamEditOpen(false)
            setSelectedProjectTeam(undefined)
          }}
          projectTeam={selectedProjectTeam}
        />
      )}
      <div style={{ display: 'flex', justifyContent: 'right', margin: '2vh 0' }}>
        <Button
          leftIcon={<IconPlus />}
          variant='filled'
          onClick={() => {
            setProjectTeamCreationModalOpen(true)
            setSelectedProjectTeam(undefined)
          }}
        >
          Create Project Team
        </Button>
      </div>
      {selectedProjectTeam && (
        <DeletionConfirmationModal
          opened={projectTeamDeletionConfirmationOpen}
          onClose={() => {
            setProjectTeamDeletionConfirmationOpen(false)
          }}
          title={`Delete team project ${selectedProjectTeam.name}`}
          text={`Are you sure you want to delete the project team ${selectedProjectTeam.name}?`}
          onConfirm={() => {
            if (selectedProjectTeam) {
              void dispatch(deleteProjectTeam(selectedProjectTeam.id))
              setProjectTeamDeletionConfirmationOpen(false)
              setSelectedProjectTeam(undefined)
            }
          }}
        />
      )}
      {selectedProjectTeam && (
        <ProjectTeamMemberListModal
          projectTeam={selectedProjectTeam}
          opened={projectTeamMemberListModalOpen}
          onClose={() => {
            setProjectTeamMemberListModalOpen(false)
            setSelectedProjectTeam(undefined)
          }}
        />
      )}
      <TextInput
        sx={{ flexBasis: '60%', margin: '1vh 0' }}
        placeholder='Search project teams...'
        icon={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.currentTarget.value)
        }}
      />
      {deleteAttemptNonEmptyProjectTeamShowed && (
        <Notification
          title='Attempt to delete non empty project team'
          onClose={() => {
            setDeleteAttemptNotEmptyProjectTeamShowed(false)
          }}
          withCloseButton
          icon={<IconAlertTriangle />}
        >
          The project team cannot be deleted because it is not empty. Please remove all team members
          before deletion.
        </Notification>
      )}
      <DataTable
        withBorder
        minHeight={200}
        noRecordsText='No records to show'
        borderRadius='sm'
        withColumnBorders
        verticalSpacing='md'
        striped
        highlightOnHover
        records={tableRecords}
        totalRecords={projectTeams.length}
        recordsPerPage={tablePageSize}
        page={tablePage}
        onPageChange={(page) => {
          setTablePage(page)
        }}
        recordsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40]}
        onRecordsPerPageChange={(pageSize) => {
          setTablePageSize(pageSize)
        }}
        columns={[
          {
            accessor: 'name',
            title: 'Team Name',
          },
          { accessor: 'customer', title: 'Customer' },
          {
            accessor: 'size',
            title: 'Team Size',
            render: ({ id }) =>
              `${studentApplications.filter((sa) => sa.projectTeam?.id === id).length}`,
          },
          {
            accessor: 'actions',
            title: <Text mr='xs'>Actions</Text>,
            textAlignment: 'right',
            render: (projectTeam) => (
              <Group spacing={4} position='right' noWrap>
                <Tooltip label='Edit project team members list'>
                  <ActionIcon
                    color='blue'
                    onClick={() => {
                      setSelectedProjectTeam(projectTeam)
                      setProjectTeamMemberListModalOpen(true)
                    }}
                  >
                    <IconUsers size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label='Edit project team'>
                  <ActionIcon
                    color='blue'
                    onClick={(e: React.MouseEvent) => {
                      setSelectedProjectTeam(projectTeam)
                      setProjectTeamEditOpen(true)
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label='Delete project team'>
                  <ActionIcon
                    color='red'
                    onClick={() => {
                      if (
                        studentApplications.filter((sa) => sa.projectTeam?.id === projectTeam.id)
                          .length > 0
                      ) {
                        setDeleteAttemptNotEmptyProjectTeamShowed(true)
                      } else {
                        setSelectedProjectTeam(projectTeam)
                        setProjectTeamDeletionConfirmationOpen(true)
                      }
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
    </>
  )
}
