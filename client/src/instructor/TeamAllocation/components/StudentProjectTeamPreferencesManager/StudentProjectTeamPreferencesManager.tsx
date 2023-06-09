import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import { useEffect, useRef, useState } from 'react'
import { Button, Group, Switch, Text, Tooltip, Transition, createStyles, px } from '@mantine/core'
import {
  IconBuilding,
  IconChevronRight,
  IconDownload,
  IconTrash,
  IconUser,
} from '@tabler/icons-react'
import { CSVLink } from 'react-csv'
import { deleteStudentProjectTeamPreferences } from '../../../../redux/studentPostKickoffSubmissionsSlice/thunks/deleteStudentProjectTeamPreferences'
import { DataTable } from 'mantine-datatable'
import { fetchStudentPostKickoffSubmissions } from '../../../../redux/studentPostKickoffSubmissionsSlice/thunks/fetchStudentPostKickoffSubmissions'

const useStyles = createStyles((theme) => ({
  expandIcon: {
    transition: 'transform 0.2s ease',
  },
  expandIconRotated: {
    transform: 'rotate(90deg)',
  },
  employeeName: {
    marginLeft: px(theme.spacing.xl) * 2,
  },
}))

export const StudentProjectTeamPreferencesManager = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const { cx, classes } = useStyles()
  const downloadLinkRef = useRef<HTMLAnchorElement & { link: HTMLAnchorElement }>(null)
  const selectedCourseIteration = useAppSelector((state) => state.courseIterations.currentState)
  const studentPostKickoffSubmissions = useAppSelector(
    (state) => state.studentPostKickoffSubmissions.studentPostKickoffSubmissions,
  )
  const projectTeams = useAppSelector((state) => state.projectTeams.projectTeams)
  const [expandedStudentIds, setExpandedStudentIds] = useState<string[]>([])
  const [expandedStudentPreferences, setExpandedStudentPreferences] = useState<string[]>([])
  const [inverseTableView, setInverseTableView] = useState(false)

  useEffect(() => {
    if (selectedCourseIteration) {
      void dispatch(fetchStudentPostKickoffSubmissions(selectedCourseIteration.semesterName))
    }
  }, [selectedCourseIteration])

  return (
    <div>
      <div
        style={{
          display: 'flex',
          justifyContent: 'right',
          alignItems: 'center',
          margin: '2vh 0',
          gap: '2vw',
        }}
      >
        <Switch
          label='Inverse Table Entries'
          checked={inverseTableView}
          onChange={(event) => {
            setInverseTableView(event.currentTarget.checked)
          }}
        />
        <Tooltip label='Out of database space reasons it is recommended to clear student project team preferences after the team allocation process is completed.'>
          <Button
            leftIcon={<IconTrash />}
            variant='outline'
            disabled={studentPostKickoffSubmissions.length === 0}
            onClick={() => {
              if (selectedCourseIteration) {
                void dispatch(
                  deleteStudentProjectTeamPreferences(selectedCourseIteration.semesterName),
                )
              }
            }}
          >
            Delete All
          </Button>
        </Tooltip>
        <Button
          leftIcon={<IconDownload />}
          variant='filled'
          disabled={studentPostKickoffSubmissions.length === 0}
          onClick={() => {
            downloadLinkRef.current?.link?.click()
          }}
        >
          Download
        </Button>
      </div>
      <CSVLink
        data={studentPostKickoffSubmissions?.flatMap((stp) =>
          stp.studentProjectTeamPreferences.map((p) => ({
            courseIterationId: selectedCourseIteration?.id,
            studentId: stp.student?.id,
            tumId: stp.student?.tumId,
            projectTeamId: p.projectTeamId,
            priorityScore: p.priorityScore,
          })),
        )}
        filename='data.csv'
        style={{ display: 'hidden' }}
        ref={downloadLinkRef}
        target='_blank'
      />
      <Transition mounted={inverseTableView} transition='fade' duration={200}>
        {(styles) => (
          <DataTable
            style={styles}
            withBorder
            withColumnBorders
            highlightOnHover
            noRecordsText='No records to show'
            columns={[
              {
                accessor: 'student',
                title: 'Student',
                render: ({ student, id }) => (
                  <Group spacing='xs'>
                    <IconChevronRight
                      size='0.9em'
                      className={cx(classes.expandIcon, {
                        [classes.expandIconRotated]: expandedStudentIds.includes(id ?? ''),
                      })}
                    />
                    <IconUser size='0.9em' />
                    <Text>{`${student?.firstName ?? ''} ${student?.lastName ?? ''} - ${
                      student?.tumId ?? ''
                    }`}</Text>
                  </Group>
                ),
              },
            ]}
            records={studentPostKickoffSubmissions}
            rowExpansion={{
              allowMultiple: true,
              expanded: {
                recordIds: expandedStudentIds,
                onRecordIdsChange: setExpandedStudentIds,
              },
              content: (record) => (
                <DataTable
                  noHeader
                  columns={[
                    {
                      accessor: 'projectTeamId',
                      render: ({ projectTeamId }) => (
                        <Group ml='lg' spacing='xs' noWrap>
                          <IconBuilding size='0.9em' />
                          <Text>
                            {projectTeams.filter((p) => p.id === projectTeamId).at(0)?.customer}
                          </Text>
                        </Group>
                      ),
                    },
                    { accessor: 'priorityScore', textAlignment: 'right', width: 200 },
                  ]}
                  records={
                    studentPostKickoffSubmissions.filter((spp) => spp.id === record.record.id).at(0)
                      ?.studentProjectTeamPreferences
                  }
                />
              ),
            }}
          />
        )}
      </Transition>
      <Transition mounted={!inverseTableView} transition='fade' duration={200}>
        {(styles) => (
          <DataTable
            style={styles}
            withBorder
            withColumnBorders
            highlightOnHover
            noRecordsText='No records to show'
            columns={[
              {
                accessor: 'id',
                title: 'Customer',
                render: ({ id, customer }) => (
                  <Group spacing='xs'>
                    <IconChevronRight
                      size='0.9em'
                      className={cx(classes.expandIcon, {
                        [classes.expandIconRotated]: expandedStudentPreferences.includes(id ?? ''),
                      })}
                    />
                    <IconBuilding size='0.9em' />
                    <Text>{customer}</Text>
                  </Group>
                ),
              },
            ]}
            records={projectTeams}
            rowExpansion={{
              allowMultiple: true,
              expanded: {
                recordIds: expandedStudentPreferences,
                onRecordIdsChange: setExpandedStudentPreferences,
              },
              content: (record) => (
                <DataTable
                  noHeader
                  noRecordsText='No records to show'
                  columns={[
                    {
                      accessor: 'student',
                      render: ({ student }) => (
                        <Group ml='lg' spacing='xs' noWrap>
                          <IconBuilding size='0.9em' />
                          <Text>
                            {`${student?.firstName ?? ''} ${student?.lastName ?? ''} - ${
                              student?.tumId ?? ''
                            }`}
                          </Text>
                        </Group>
                      ),
                    },
                    {
                      accessor: 'priorityScore',
                      render: ({ studentProjectTeamPreferences }) => (
                        <Group ml='lg' spacing='xs' noWrap>
                          <IconBuilding size='0.9em' />
                          <Text>
                            {`${
                              studentProjectTeamPreferences
                                .filter((p) => p.projectTeamId === record.record.id)
                                .at(0)?.priorityScore ?? ''
                            }`}
                          </Text>
                        </Group>
                      ),
                    },
                  ]}
                  records={studentPostKickoffSubmissions.filter((spp) => {
                    return spp.studentProjectTeamPreferences
                      .map((p) => p.projectTeamId)
                      .includes(record.record.id)
                  })}
                />
              ),
            }}
          />
        )}
      </Transition>
    </div>
  )
}
