import { Paper, Text } from '@mantine/core'

export const KickOffCourseAgreement = (): JSX.Element => {
  return (
    <Paper>
      <Text c='dimmed' fz='sm'>
        Are you willing to sign the following course agreement?: <br />
        <br />
        <br />
        Lab course „iPraktikum“ Agreement between Student and the Group for Applied Software
        Engineering (referenced as &quot;Group&quot; from this point on) - Nondisclosure Agreement
        and Rights to the Works
        <br />
        <br />
        1. I undertake to keep all company data and knowledge about business processes that I learn
        during the lab course as confidential unless they have been publicly available before, and
        that I will not pass on this data or knowledge to anyone not concerned with the lab course.
        At the end of the project, I will immediately delete all files and data which I received as
        part of the project.
        <br />
        <br />
        2. Should I, as part of my task during the lab course or due to the knowledge gained from
        the project, create a computer program or any other work, only the Group is entitled to
        exercise all commercial rights relating to the computer program or the other work. The Group
        is entitled to the exclusive, transferable, and irrevocable rights regarding computer
        programs, work, or invention, to use as is or modified, and to give third parties the rights
        of use. I am aware that in case of offense I will be excluded from the course and will not
        receive any certificate for the lab.
        <br />
      </Text>
    </Paper>
  )
}
