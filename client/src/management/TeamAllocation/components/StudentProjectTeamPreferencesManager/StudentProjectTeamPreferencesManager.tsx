import { useAppSelector } from '../../../../redux/store'
import { useRef, useState } from 'react'
import { Button, Group, Switch, Text, Transition } from '@mantine/core'
import { IconBuilding, IconChevronRight, IconDownload, IconUser } from '@tabler/icons-react'
import { CSVLink } from 'react-csv'
import { DataTable } from 'mantine-datatable'
import './StudentProjectTeamPreferencesManager.scss'
import classNames from 'classnames'
import { useApplicationStore } from '../../../../state/zustand/useApplicationStore'
import { useProjectTeamStore } from '../../../../state/zustand/useProjectTeamStore'
import { useIntroCourseStore } from '../../../../state/zustand/useIntroCourseStore'

export const StudentProjectTeamPreferencesManager = (): JSX.Element => {
  const enrolledDeveloperApplications = useApplicationStore((state) =>
    state.developerApplications.filter(
      (application) => application.assessment.status === 'INTRO_COURSE_PASSED',
    ),
  )
  const downloadLinkRef = useRef<HTMLAnchorElement & { link: HTMLAnchorElement }>(null)
  const studentPostKickoffSubmissions = useAppSelector(
    (state) => state.studentPostKickoffSubmissions.studentPostKickoffSubmissions,
  )
  const { participations: introCourseParticipations } = useIntroCourseStore()
  const { projectTeams } = useProjectTeamStore()
  const [expandedStudentIds, setExpandedStudentIds] = useState<string[]>([])
  const [expandedStudentPreferences, setExpandedStudentPreferences] = useState<string[]>([])
  const [inverseTableView, setInverseTableView] = useState(false)

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
        <Button
          leftSection={<IconDownload />}
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
        data={enrolledDeveloperApplications?.map((student) => {
          let result = {
            firstName: student.student.firstName,
            lastName: student.student.lastName,
            nationality: student.student.nationality,
            tumId: student.student.tumId,
            matriculationNumber: student.student.matriculationNumber,
            email: student.student.email,
            gender: student.student.gender,
            major: `${student.studyProgram ?? ''} ${student.studyDegree ?? ''}`,
            semester: student.currentSemester,
            germanProficiency: student.germanLanguageProficiency,
            englishProficiency: student.englishLanguageProficiency,
            supervisorAssessment: introCourseParticipations
              .filter((participation) => participation.student.id === student.student.id)
              .at(0)?.supervisorAssessment,
            selfAssessment: studentPostKickoffSubmissions
              .filter((stp) => stp.student?.id === student.student.id)
              .at(0)?.selfReportedExperienceLevel,
            devices: student.devices,
          }
          studentPostKickoffSubmissions
            .filter((stp) => stp.student?.id === student.student.id)
            .forEach((stp) => {
              const preferences = new Map()
              stp.studentProjectTeamPreferences.forEach((p) => {
                preferences.set(
                  `Priorities[${p.priorityScore + 1}]`,
                  projectTeams.filter((projectTeam) => projectTeam.id === p.projectTeamId).at(0)
                    ?.customer,
                )
              })
              result = { ...result, ...Object.fromEntries(preferences) }

              const skills = new Map()
              stp.studentSkills.forEach((skill) => {
                skills.set(`Skills[${skill.skill.title}]`, skill.skillProficiency)
              })
              result = { ...result, ...Object.fromEntries(skills) }
            })
          return result
        })}
        filename='data.csv'
        style={{ display: 'hidden' }}
        ref={downloadLinkRef}
        target='_blank'
      />
      <Transition mounted={inverseTableView} transition='fade' duration={200}>
        {(styles) => (
          <DataTable
            style={styles}
            withTableBorder
            minHeight={200}
            withColumnBorders
            highlightOnHover
            noRecordsText='No records to show'
            columns={[
              {
                accessor: 'student',
                title: 'Student',
                render: ({ student, id }) => (
                  <Group gap='xs'>
                    <IconChevronRight
                      size='0.9em'
                      className={classNames('expandIcon', {
                        ['expandIconRotated']: expandedStudentIds.includes(id ?? ''),
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
                        <Group ml='lg' gap='xs' wrap='nowrap'>
                          <IconBuilding size='0.9em' />
                          <Text>
                            {projectTeams.filter((p) => p.id === projectTeamId).at(0)?.customer}
                          </Text>
                        </Group>
                      ),
                    },
                    {
                      accessor: 'priorityScore',
                      textAlign: 'right',
                      width: 200,
                      render: ({ priorityScore }) => priorityScore + 1,
                    },
                  ]}
                  records={[
                    ...(studentPostKickoffSubmissions
                      .filter((spp) => spp.id === record.record.id)
                      .at(0)?.studentProjectTeamPreferences ?? []),
                  ].sort((a, b) => a.priorityScore - b.priorityScore)}
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
            minHeight={200}
            withTableBorder
            withColumnBorders
            highlightOnHover
            noRecordsText='No records to show'
            columns={[
              {
                accessor: 'id',
                title: 'Customer',
                render: ({ id, customer }) => (
                  <Group gap='xs'>
                    <IconChevronRight
                      size='0.9em'
                      className={classNames('expandIcon', {
                        ['expandIconRotated']: expandedStudentPreferences.includes(id ?? ''),
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
                  minHeight={200}
                  noRecordsText='No records to show'
                  columns={[
                    {
                      accessor: 'student',
                      render: ({ student }) => (
                        <Group ml='lg' gap='xs' wrap='nowrap'>
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
                        <Group ml='lg' gap='xs' wrap='nowrap'>
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
