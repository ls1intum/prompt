import { useDispatch } from 'react-redux'
import { type AppDispatch, useAppSelector } from '../../../../redux/store'
import { useEffect, useRef } from 'react'
import { fetchStudentProjectTeamPreferences } from '../../../../redux/studentProjectTeamPreferencesSlice/thunks/fetchStudentProjectTeamPreferences'
import { Button, Table, Tooltip } from '@mantine/core'
import { IconDownload, IconTrash } from '@tabler/icons-react'
import { CSVLink } from 'react-csv'
import { deleteStudentProjectTeamPreferences } from '../../../../redux/studentProjectTeamPreferencesSlice/thunks/deleteStudentProjectTeamPreferences'

export const StudentProjectTeamPreferencesManager = (): JSX.Element => {
  const dispatch = useDispatch<AppDispatch>()
  const downloadLinkRef = useRef<HTMLAnchorElement & { link: HTMLAnchorElement }>(null)
  const selectedApplicationSemester = useAppSelector(
    (state) => state.applicationSemester.currentState,
  )
  const studentProjectTeamPreferences = useAppSelector(
    (state) => state.studentProjectTeamPreferences.studentProjectTeamPreferences,
  )
  const projectTeams = useAppSelector((state) => state.projectTeams.projectTeams)

  useEffect(() => {
    if (selectedApplicationSemester) {
      void dispatch(fetchStudentProjectTeamPreferences(selectedApplicationSemester.semesterName))
    }
  }, [selectedApplicationSemester])

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'right', margin: '2vh 0', gap: '2vw' }}>
        <Tooltip label='Out of database space reasons it is recommended to clear student project team preferences after the team allocation process is completed.'>
          <Button
            leftIcon={<IconTrash />}
            variant='outline'
            disabled={studentProjectTeamPreferences.length === 0}
            onClick={() => {
              if (selectedApplicationSemester) {
                void dispatch(
                  deleteStudentProjectTeamPreferences(selectedApplicationSemester.semesterName),
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
          disabled={studentProjectTeamPreferences.length === 0}
          onClick={() => {
            downloadLinkRef.current?.link?.click()
          }}
        >
          Download
        </Button>
      </div>
      <CSVLink
        data={studentProjectTeamPreferences.map((stp) => {
          return {
            applicationSemesterId: stp.applicationSemesterId,
            studentId: stp.studentId,
            projectTeamId: stp.projectTeamId,
            priorityScore: stp.priorityScore,
          }
        })}
        filename='data.csv'
        style={{ display: 'hidden' }}
        ref={downloadLinkRef}
        target='_blank'
      />
      <Table>
        <thead>
          <tr>
            <th>Student</th>
            <th>Project Team</th>
            <th>Priority Score</th>
          </tr>
        </thead>
        <tbody>
          {studentProjectTeamPreferences.map((sp) => {
            return (
              <tr key={`${sp.studentId}${sp.projectTeamId}`}>
                <td>{`${sp.student?.firstName ?? ''} ${sp.student?.lastName ?? ''}`}</td>
                <td>
                  {
                    projectTeams.filter((pt) => {
                      return pt.id === sp.projectTeamId
                    })[0].customer
                  }
                </td>
                <td>{sp.priorityScore}</td>
              </tr>
            )
          })}
        </tbody>
      </Table>
    </div>
  )
}
