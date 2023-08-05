import { DataTable } from 'mantine-datatable'
import { type AppDispatch, useAppSelector } from '../../../redux/store'
import { useEffect, useState } from 'react'
import { type IntroCourseParticipation } from '../../../redux/introCourseSlice/introCourseSlice'
import {
  Group,
  Tooltip,
  ActionIcon,
  Text,
  Stack,
  TextInput,
  Modal,
  Select,
  Button,
} from '@mantine/core'
import { IconEdit, IconSearch } from '@tabler/icons-react'
import { type Application } from '../../../redux/applicationsSlice/applicationsSlice'
import { useForm } from '@mantine/form'
import { useDispatch } from 'react-redux'
import { type Patch } from '../../../service/configService'
import { updateIntroCourseParticipation } from '../../../redux/introCourseSlice/thunks/updateIntroCourseParticipation'

interface SeatPlanEditModalProps {
  opened: boolean
  onClose: () => void
  introCourseParticipation: IntroCourseParticipation
  tutors: Application[]
}

const SeatPlanEditModal = ({
  opened,
  onClose,
  tutors,
  introCourseParticipation,
}: SeatPlanEditModalProps): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const introCourseParticipationForm = useForm({
    initialValues: {
      tutorApplicationId: introCourseParticipation.tutorApplicationId ?? '',
      seat: introCourseParticipation.seat ?? '',
    },
  })

  useEffect(() => {
    introCourseParticipationForm.setValues({
      tutorApplicationId: introCourseParticipation.tutorApplicationId ?? '',
      seat: introCourseParticipation.seat ?? '',
    })
  }, [introCourseParticipation])

  const close = (): void => {
    introCourseParticipationForm.reset()
    onClose()
  }

  return (
    <Modal centered size='90%' opened={opened} onClose={close}>
      <Stack>
        <Select
          label='Assigned Tutor'
          placeholder='Assigned tutor'
          withinPortal
          data={[
            ...tutors.map((tutor) => {
              return {
                label: `${tutor.student.firstName ?? ''} ${tutor.student.lastName ?? ''}`,
                value: tutor.id,
              }
            }),
          ]}
          {...introCourseParticipationForm.getInputProps('tutorApplicationId')}
        />
        <TextInput
          label='Seat'
          placeholder='Seat'
          {...introCourseParticipationForm.getInputProps('seat')}
        />
        <Group position='right'>
          <Button
            onClick={() => {
              const introCourseParticipationPatchObjectArray: Patch[] = []
              Object.keys(introCourseParticipationForm.values).forEach((key) => {
                if (introCourseParticipationForm.isDirty(key)) {
                  const introCoursePrticipationPatchObject = new Map()
                  introCoursePrticipationPatchObject.set('op', 'replace')
                  introCoursePrticipationPatchObject.set('path', '/' + key)
                  introCoursePrticipationPatchObject.set(
                    'value',
                    introCourseParticipationForm.getInputProps(key).value,
                  )
                  const obj = Object.fromEntries(introCoursePrticipationPatchObject)
                  introCourseParticipationPatchObjectArray.push(obj)
                }
              })

              void dispatch(
                updateIntroCourseParticipation({
                  introCourseParticipationId: introCourseParticipation.id,
                  introCourseParticipationPatch: introCourseParticipationPatchObjectArray,
                }),
              )

              close()
            }}
          >
            Save
          </Button>
        </Group>
      </Stack>
    </Modal>
  )
}

export const SeatPlanManager = (): JSX.Element => {
  const participations = useAppSelector((state) => state.introCourse.participations)
  const tutors = useAppSelector((state) =>
    state.applications.tutorApplications.filter((ta) => ta.assessment.status === 'ENROLLED'),
  )
  const [tablePageSize, setTablePageSize] = useState(20)
  const [tablePage, setTablePage] = useState(1)
  const [tableRecords, setTableRecords] = useState<IntroCourseParticipation[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedParticipation, setSelectedParticipation] =
    useState<IntroCourseParticipation | null>()
  const [participationEditModalOpened, setParticipationEditModalOpened] = useState(false)

  useEffect(() => {
    const from = (tablePage - 1) * tablePageSize
    const to = from + tablePageSize
    setTableRecords(
      participations
        .filter(({ developerApplication, seat }) => {
          return `${developerApplication.student?.firstName?.toLowerCase() ?? ''} ${
            developerApplication.student?.lastName?.toLowerCase() ?? ''
          } ${seat?.toLowerCase() ?? ''}`.includes(searchQuery.toLowerCase())
        })
        .slice(from, to),
    )
  }, [participations, tablePageSize, tablePage, searchQuery])

  return (
    <Stack>
      {selectedParticipation && (
        <SeatPlanEditModal
          opened={participationEditModalOpened}
          onClose={() => {
            setParticipationEditModalOpened(false)
          }}
          tutors={tutors}
          introCourseParticipation={selectedParticipation}
        />
      )}
      <TextInput
        sx={{ flexBasis: '60%', margin: '1vh 0' }}
        placeholder='Search students...'
        icon={<IconSearch size={16} />}
        value={searchQuery}
        onChange={(e) => {
          setSearchQuery(e.currentTarget.value)
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
        records={tableRecords}
        totalRecords={participations.length}
        recordsPerPage={tablePageSize}
        page={tablePage}
        onPageChange={(page) => {
          setTablePage(page)
        }}
        recordsPerPageOptions={[5, 10, 15, 20, 25, 30, 35, 40]}
        onRecordsPerPageChange={(pageSize) => {
          setTablePageSize(pageSize)
        }}
        onRowClick={(introCourseParticipation) => {
          setSelectedParticipation(introCourseParticipation)
          setParticipationEditModalOpened(true)
        }}
        columns={[
          {
            accessor: 'developerApplication.student.firstName',
            title: 'First Name',
          },
          {
            accessor: 'developerApplication.student.lastName',
            title: 'Last Name',
          },
          {
            accessor: 'tutorApplicationId',
            title: 'Tutor',
            render: ({ tutorApplicationId }) =>
              `${
                tutors.filter((tutor) => tutor.id === tutorApplicationId).at(0)?.student
                  .firstName ?? ''
              } ${
                tutors.filter((tutor) => tutor.id === tutorApplicationId).at(0)?.student.lastName ??
                ''
              }`,
          },
          {
            accessor: 'seat',
            title: 'Seat',
          },
          {
            accessor: 'actions',
            title: <Text mr='xs'>Actions</Text>,
            textAlignment: 'right',
            render: (participation) => (
              <Group spacing={4} position='right' noWrap>
                <Tooltip label='Edit'>
                  <ActionIcon
                    color='blue'
                    onClick={(e: React.MouseEvent) => {
                      setSelectedParticipation(participation)
                      setParticipationEditModalOpened(true)
                    }}
                  >
                    <IconEdit size={16} />
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
