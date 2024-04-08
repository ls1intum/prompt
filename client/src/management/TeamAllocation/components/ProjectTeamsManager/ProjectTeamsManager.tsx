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
import { ProjectTeamMemberListModal } from './ProjectTeamMemberListModal'
import { ConfirmationModal } from '../../../../utilities/ConfirmationModal'
import { useAutoAnimate } from '@formkit/auto-animate/react'
import { notifications } from '@mantine/notifications'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { patchProjectTeam, postProjectTeam } from '../../../../network/projectTeam'
import { Query } from '../../../../state/query'
import { useProjectTeamStore } from '../../../../state/zustand/useProjectTeamStore'
import { Patch } from '../../../../network/configService'
import { useCourseIterationStore } from '../../../../state/zustand/useCourseIterationStore'
import { Application, ApplicationType } from '../../../../interface/application'
import { getApplications } from '../../../../network/application'
import { ProjectTeam } from '../../../../interface/projectTeam'
import { postInvitationsToPostKickOffSubmissions } from '../../../../network/postKickOffSubmission'

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
  const queryClient = useQueryClient()
  const { selectedCourseIteration } = useCourseIterationStore()
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

  const createProjectTeam = useMutation({
    mutationFn: () => {
      return postProjectTeam(selectedCourseIteration?.semesterName ?? '', form.values)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.PROJECT_TEAM] })
      form.reset()
      onClose()
    },
  })

  const updateProjectTeam = useMutation({
    mutationFn: (projectTeamPatch: Patch[]) => {
      return patchProjectTeam(projectTeam?.id ?? '', projectTeamPatch)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.PROJECT_TEAM] })
      form.reset()
      onClose()
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
                const projectTeamPatchObjectArray: Patch[] = []
                Object.keys(form.values).forEach((key) => {
                  const projectTeamPatchObject = new Map()
                  projectTeamPatchObject.set('op', 'replace')
                  projectTeamPatchObject.set('path', '/' + key)
                  projectTeamPatchObject.set('value', form.getInputProps(key).value)
                  const obj = Object.fromEntries(projectTeamPatchObject)
                  projectTeamPatchObjectArray.push(obj)
                })

                updateProjectTeam.mutate(projectTeamPatchObjectArray)
              } else {
                createProjectTeam.mutate()
              }
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
  const queryClient = useQueryClient()
  const { selectedCourseIteration } = useCourseIterationStore()
  const { projectTeams } = useProjectTeamStore()
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

  const { data: developerApplications = [], isLoading } = useQuery<Application[]>({
    queryKey: [Query.DEVELOPER_APPLICATION],
    queryFn: () =>
      getApplications(
        ApplicationType.DEVELOPER,
        selectedCourseIteration?.semesterName ?? '',
        'INTRO_COURSE_PASSED',
      ),
  })

  const deleteProjectTeam = useMutation({
    mutationFn: (projectTeamId: string) => {
      return deleteProjectTeam(projectTeamId)
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [Query.PROJECT_TEAM] })
    },
  })

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
    <Stack style={{ margin: '2vh 0' }}>
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
            postInvitationsToPostKickOffSubmissions(selectedCourseIteration.semesterName)
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
          style={{ flexBasis: '40%', margin: '1vh 0' }}
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
              deleteProjectTeam.mutate(selectedProjectTeam.id)
              setProjectTeamDeletionConfirmationOpen(false)
              setSelectedProjectTeam(undefined)
            }
          }}
        />
      )}
      {selectedProjectTeam && (
        <ProjectTeamMemberListModal
          applications={developerApplications}
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
        fetching={isLoading}
        withTableBorder
        highlightOnHover
        borderRadius='sm'
        striped
        minHeight={200}
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
              `${developerApplications.filter((sa) => sa.projectTeam?.id === id).length}`,
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
                        developerApplications.filter((sa) => sa.projectTeam?.id === projectTeam.id)
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
