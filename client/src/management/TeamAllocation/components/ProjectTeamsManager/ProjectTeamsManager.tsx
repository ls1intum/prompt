import {
  ActionIcon,
  Button,
  Group,
  Modal,
  Notification,
  Stack,
  TextInput,
  Tooltip,
} from '@mantine/core'
import { useForm } from '@mantine/form'
import {
  IconAlertTriangle,
  IconEdit,
  IconMailFilled,
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
import { updateProjectTeam } from '../../../../redux/projectTeamsSlice/thunks/updateProjectTeam'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import { ProjectTeamMemberListModal } from './ProjectTeamMemberListModal'
import { ConfirmationModal } from '../../../../utilities/ConfirmationModal'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { sendKickoffSubmissionInvitations } from '../../../../redux/studentPostKickoffSubmissionsSlice/thunks/sendKickoffSubmissionInvitations'
import { notifications } from '@mantine/notifications'

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
          projectLeadTumId: '',
          coachTumId: '',
        },
  })

  return (
    <Modal title={projectTeam?.customer} opened={opened} onClose={onClose} centered>
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
        <Group grow>
          <TextInput
            label='Project Lead TUM ID'
            placeholder='Project lead TUM ID'
            {...form.getInputProps('projectLeadTumId')}
          />
          <TextInput
            label='Coach TUM ID'
            placeholder='Coach TUM ID'
            {...form.getInputProps('coachTumId')}
          />
        </Group>
        <Button
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
  const [invitationSendOutConfirmationModalOpened, setInvitationSendOutConfirmationModalOpened] =
    useState(false)
  const [projectTeamCreationModalOpen, setProjectTeamCreationModalOpen] = useState(false)
  const [projectTeamEditModalOpen, setProjectTeamEditOpen] = useState(false)
  const [projectTeamMemberListModalOpen, setProjectTeamMemberListModalOpen] = useState(false)
  const [selectedProjectTeam, setSelectedProjectTeam] = useState<ProjectTeam | undefined>()
  const [projectTeamDeletionConfirmationOpen, setProjectTeamDeletionConfirmationOpen] =
    useState(false)
  const [bodyRef] = useAutoAnimate<HTMLTableSectionElement>()
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tablePage, setTablePage] = useState(1)
  const [tableRecords, setTableRecords] = useState<ProjectTeam[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [deleteAttemptNonEmptyProjectTeamShowed, setDeleteAttemptNotEmptyProjectTeamShowed] =
    useState(false)

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
    <Stack>
      <ConfirmationModal
        title='Kick-Off Submission Invitations Send Out'
        text="Are You sure You would like to invite students to submit 
        their team allocation preferences? A student will receive a personal 
        link to a form. Make sure the kick off submission period dates are specified, otherwise the students won't be able to access the form."
        opened={invitationSendOutConfirmationModalOpened}
        onClose={() => {
          setInvitationSendOutConfirmationModalOpened(false)
        }}
        onConfirm={() => {
          if (selectedCourseIteration) {
            void dispatch(sendKickoffSubmissionInvitations(selectedCourseIteration.semesterName))
            setInvitationSendOutConfirmationModalOpened(false)
          } else {
            notifications.show({
              title: 'No course iteration selected',
              message: 'Please select a course iteration first.',
              color: 'red',
            })
          }
        }}
      />
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
      <Group align='apart'>
        <TextInput
          style={{ flexBasis: '60%', margin: '1vh 0' }}
          placeholder='Search project teams...'
          leftSection={<IconSearch size={16} />}
          value={searchQuery}
          onChange={(e) => {
            setSearchQuery(e.currentTarget.value)
          }}
        />
        <Group>
          <Button
            leftSection={<IconMailFilled />}
            onClick={() => {
              setInvitationSendOutConfirmationModalOpened(true)
            }}
          >
            Send Kick-Off Invitations
          </Button>
          <Button
            leftSection={<IconPlus />}
            variant='filled'
            onClick={() => {
              setProjectTeamCreationModalOpen(true)
              setSelectedProjectTeam(undefined)
            }}
          >
            Create Project Team
          </Button>
        </Group>
      </Group>
      {selectedProjectTeam && (
        <ConfirmationModal
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
        withTableBorder
        highlightOnHover
        borderRadius='sm'
        striped
        verticalAlign='top'
        bodyRef={bodyRef}
        records={tableRecords}
        totalRecords={projectTeams.length}
        recordsPerPage={tablePageSize}
        page={tablePage}
        onPageChange={(page) => {
          setTablePage(page)
        }}
        onRowClick={({ record }) => {
          setSelectedProjectTeam(record)
          setProjectTeamEditOpen(true)
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
            title: 'Actions',
            textAlign: 'right',
            render: (projectTeam) => (
              <Group gap={4} justify='flex-end' wrap='nowrap'>
                <Tooltip label='Edit project team members list'>
                  <ActionIcon
                    variant='transparent'
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
                    variant='transparent'
                    color='blue'
                    onClick={() => {
                      setSelectedProjectTeam(projectTeam)
                      setProjectTeamEditOpen(true)
                    }}
                  >
                    <IconEdit size={16} />
                  </ActionIcon>
                </Tooltip>
                <Tooltip label='Delete project team'>
                  <ActionIcon
                    variant='transparent'
                    color='red'
                    onClick={(e) => {
                      if (
                        studentApplications.filter((sa) => sa.projectTeam?.id === projectTeam.id)
                          .length > 0
                      ) {
                        setDeleteAttemptNotEmptyProjectTeamShowed(true)
                      } else {
                        e.stopPropagation()
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
    </Stack>
  )
}
