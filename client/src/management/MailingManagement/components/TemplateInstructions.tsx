import { Table } from '@mantine/core'
import {
  Course,
  Device,
  Gender,
  LanguageProficiency,
  StudyDegree,
  StudyProgram,
} from '../../../redux/applicationsSlice/applicationsSlice'
import moment from 'moment'
import {
  FocusTopic,
  ResearchArea,
} from '../../../redux/thesisApplicationsSlice/thesisApplicationsSlice'

const mockStudent = {
  publicId: '9002767c-3247-49bc-9cc9-aadb1bbbc9ca',
  firstName: 'John',
  lastName: 'Doe',
  email: 'john.doe@email.com',
  tumId: 'aa11aaa',
  matriculationNumber: '12345678',
  gender: Gender.MALE,
  nationality: 'Germany',
  isExchangeStudent: false,
}

const mockCourseIteration = {
  id: '26f61b12-cac8-4163-9315-00a14f446019',
  semesterName: 'WS2324',
  iosTag: 'ios2324',
  developerApplicationPeriodStart: '2023-10-01',
  developerApplicationPeriodEnd: '2023-10-31',
  coachApplicationPeriodStart: '2023-10-01',
  coachApplicationPeriodEnd: '2023-10-31',
  tutorApplicationPeriodStart: '2023-10-01',
  tutorApplicationPeriodEnd: '2023-10-31',
  coachInterviewDate: '2023-11-15',
  tutorInterviewDate: '2023-11-16',
  coachInterviewLocation: 'http://zoom.us/coach-interview',
  tutorInterviewLocation: 'http://zoom.us/tutor-interview',
  coachInterviewPlannerLink: 'http://example.com/coach-interview',
  tutorInterviewPlannerLink: 'http://example.com/tutor-interview',
  introCourseStart: '2023-11-01',
  introCourseEnd: '2023-11-14',
  kickoffSubmissionPeriodStart: '2023-11-17',
}

const mockThesisAdvisor = {
  firstName: 'Max',
  lastName: 'Mustermann',
  email: 'max.mustermann@example.com',
  tumId: 'aa11aaa',
}

const mockThesisApplication = {
  currentSemester: '4',
  studyDegree: StudyDegree.BACHELOR,
  studyProgram: StudyProgram.COMPUTER_SCIENCE,
  thesisTitle: 'Exploring Applications of Artificial Intelligence in Web Development',
  desiredThesisStart: '2023-09-01',
  interests: 'Artificial Intelligence, Web Development, Machine Learning',
  projects: 'Developed a chatbot using Python, Implemented a web application using React',
  specialSkills: 'Python, JavaScript, React, Machine Learning',
  motivation:
    'I am deeply interested in exploring how AI can be leveraged to enhance user experience on the web.',
  researchAreas: [ResearchArea.EDUCATION_TECHNOLOGIES, ResearchArea.ROBOTIC],
  focusTopics: [FocusTopic.ADAPTIVE_LEARNING, FocusTopic.COMMUNICATION],
}

const mockDeveloperApplication = {
  currentSemester: '3',
  studyDegree: StudyDegree.BACHELOR,
  studyProgram: StudyProgram.INFORMATION_SYSTEMS,
  germanLanguageProficiency: LanguageProficiency.B1B2,
  englishLanguageProficiency: LanguageProficiency.C1C2,
  devices: [Device.IPHONE, Device.IPAD],
  coursesTaken: [Course.ITP, Course.JASS, Course.PSE],
  experience: '2 years of web development using JavaScript and Python',
  motivation:
    'I am eager to apply my skills in a real-world project and learn more about software development in a team setting.',
}

const mockCoachApplication = {
  currentSemester: '3',
  studyDegree: StudyDegree.BACHELOR,
  studyProgram: StudyProgram.INFORMATION_SYSTEMS,
  germanLanguageProficiency: LanguageProficiency.B1B2,
  englishLanguageProficiency: LanguageProficiency.C1C2,
  devices: [Device.IPHONE, Device.IPAD],
  coursesTaken: [Course.ITP, Course.JASS, Course.PSE],
  experience: '2 years of web development using JavaScript and Python',
  motivation:
    'I am eager to apply my skills in a real-world project and learn more about software development in a team setting.',
  solvedProblem:
    'Implemented a dynamic programming solution to optimize resource allocation in a software project.',
}

const mockTutorApplication = {
  currentSemester: '3',
  studyDegree: StudyDegree.BACHELOR,
  studyProgram: StudyProgram.INFORMATION_SYSTEMS,
  germanLanguageProficiency: LanguageProficiency.B1B2,
  englishLanguageProficiency: LanguageProficiency.C1C2,
  devices: [Device.IPHONE, Device.IPAD],
  coursesTaken: [Course.ITP, Course.JASS, Course.PSE],
  experience: '2 years of web development using JavaScript and Python',
  motivation:
    'I am eager to apply my skills in a real-world project and learn more about software development in a team setting.',
  reasonGoodTutor:
    'I have prior experience as a teaching assistant and have received positive feedback from students.',
}

export const fillMockStudentPlaceholders = (template: string): string => {
  return template
    .replace(/{{student.publicId}}/g, mockStudent.publicId)
    .replace(/{{student.firstName}}/g, mockStudent.firstName)
    .replace(/{{student.lastName}}/g, mockStudent.lastName)
    .replace(/{{student.email}}/g, mockStudent.email)
    .replace(/{{student.tumId}}/g, mockStudent.tumId)
    .replace(/{{student.matriculationNumber}}/g, mockStudent.matriculationNumber)
    .replace(/{{student.gender}}/g, mockStudent.gender)
    .replace(/{{student.nationality}}/g, mockStudent.nationality)
    .replace(/{{student.isExchangeStudent}}/g, mockStudent.isExchangeStudent.toString())
}

export const fillMockCourseIterationPlaceholders = (template: string): string => {
  const pattern = 'DD. MMM YYYY'

  return template
    .replace(/{{course.semesterName}}/g, mockCourseIteration.semesterName)
    .replace(/{{course.iosTag}}/g, mockCourseIteration.iosTag)
    .replace(
      /{{course.developerApplicationPeriodStart}}/g,
      moment(mockCourseIteration.developerApplicationPeriodStart).format(pattern),
    )
    .replace(
      /{{course.developerApplicationPeriodEnd}}/g,
      moment(mockCourseIteration.developerApplicationPeriodEnd).format(pattern),
    )
    .replace(
      /{{course.coachApplicationPeriodStart}}/g,
      moment(mockCourseIteration.coachApplicationPeriodStart).format(pattern),
    )
    .replace(
      /{{course.coachApplicationPeriodEnd}}/g,
      moment(mockCourseIteration.coachApplicationPeriodEnd).format(pattern),
    )
    .replace(
      /{{course.tutorApplicationPeriodStart}}/g,
      moment(mockCourseIteration.tutorApplicationPeriodStart).format(pattern),
    )
    .replace(
      /{{course.tutorApplicationPeriodEnd}}/g,
      moment(mockCourseIteration.tutorApplicationPeriodEnd).format(pattern),
    )
    .replace(
      /{{course.coachInterviewDate}}/g,
      moment(mockCourseIteration.coachInterviewDate).format(pattern),
    )
    .replace(
      /{{course.tutorInterviewDate}}/g,
      moment(mockCourseIteration.tutorInterviewDate).format(pattern),
    )
    .replace(/{{course.coachInterviewPlannerLink}}/g, mockCourseIteration.coachInterviewPlannerLink)
    .replace(/{{course.tutorInterviewPlannerLink}}/g, mockCourseIteration.tutorInterviewPlannerLink)
    .replace(/{{course.coachInterviewLocation}}/g, mockCourseIteration.coachInterviewLocation)
    .replace(/{{course.tutorInterviewLocation}}/g, mockCourseIteration.tutorInterviewLocation)
    .replace(
      /{{course.introCourseStart}}/g,
      moment(mockCourseIteration.introCourseStart).format(pattern),
    )
    .replace(
      /{{course.introCourseEnd}}/g,
      moment(mockCourseIteration.introCourseEnd).format(pattern),
    )
    .replace(
      /{{course.kickoffSubmissionPeriodStart}}/g,
      moment(mockCourseIteration.kickoffSubmissionPeriodStart).format(pattern),
    )
}

export const fillMockThesisAdvisorPlaceholders = (template: string): string => {
  return template
    .replace(/{{advisor.firstName}}/g, mockThesisAdvisor.firstName)
    .replace(/{{advisor.lastName}}/g, mockThesisAdvisor.lastName)
    .replace(/{{advisor.email}}/g, mockThesisAdvisor.email)
    .replace(/{{advisor.tumId}}/g, mockThesisAdvisor.tumId)
}

export const fillMockThesisApplicationPlaceholders = (template: string): string => {
  const pattern = 'DD. MMM YYYY'

  return template
    .replace(/{{application.studyProgram}}/g, mockThesisApplication.studyProgram)
    .replace(/{{application.studyDegree}}/g, mockThesisApplication.studyDegree)
    .replace(/{{application.currentSemester}}/g, mockThesisApplication.currentSemester.toString())
    .replace(
      /{{application.desiredThesisStart}}/g,
      moment(mockThesisApplication.desiredThesisStart).format(pattern),
    )
    .replace(/{{application.specialSkills}}/g, mockThesisApplication.specialSkills)
    .replace(/{{application.motivation}}/g, mockThesisApplication.motivation)
    .replace(/{{application.interests}}/g, mockThesisApplication.interests)
    .replace(/{{application.projects}}/g, mockThesisApplication.projects)
    .replace(/{{application.thesisTitle}}/g, mockThesisApplication.thesisTitle)
    .replace(/{{application.researchAreas}}/g, mockThesisApplication.researchAreas.join(', '))
    .replace(/{{application.focusTopics}}/g, mockThesisApplication.focusTopics.join(', '))
}

export const fillDeveloperApplicationPlaceholders = (template: string): string => {
  return template
    .replace(/{{application.studyDegree}}/g, mockDeveloperApplication.studyDegree)
    .replace(/{{application.studyProgram}}/g, mockDeveloperApplication.studyProgram)
    .replace(
      /{{application.currentSemester}}/g,
      mockDeveloperApplication.currentSemester.toString(),
    )
    .replace(/{{application.devices}}/g, mockDeveloperApplication.devices.join(', '))
    .replace(/{{application.coursesTaken}}/g, mockDeveloperApplication.coursesTaken.join(', '))
    .replace(
      /{{application.germanLanguageProficiency}}/g,
      mockDeveloperApplication.germanLanguageProficiency,
    )
    .replace(
      /{{application.englishLanguageProficiency}}/g,
      mockDeveloperApplication.englishLanguageProficiency,
    )
    .replace(/{{application.motivation}}/g, mockDeveloperApplication.motivation)
    .replace(/{{application.experience}}/g, mockDeveloperApplication.experience)
}

export const fillMockCoachApplicationPlaceholders = (template: string): string => {
  return template
    .replace(/{{application.studyDegree}}/g, mockCoachApplication.studyDegree)
    .replace(/{{application.studyProgram}}/g, mockCoachApplication.studyProgram)
    .replace(/{{application.currentSemester}}/g, mockCoachApplication.currentSemester.toString())
    .replace(/{{application.devices}}/g, mockCoachApplication.devices.join(', '))
    .replace(/{{application.coursesTaken}}/g, mockCoachApplication.coursesTaken.join(', '))
    .replace(
      /{{application.germanLanguageProficiency}}/g,
      mockCoachApplication.germanLanguageProficiency,
    )
    .replace(
      /{{application.englishLanguageProficiency}}/g,
      mockCoachApplication.englishLanguageProficiency,
    )
    .replace(/{{application.motivation}}/g, mockCoachApplication.motivation)
    .replace(/{{application.experience}}/g, mockCoachApplication.experience)
    .replace(/{{application.solvedProblem}}/g, mockCoachApplication.solvedProblem)
}

export const fillMockTutorApplicationPlaceholders = (template: string): string => {
  return template
    .replace(/{{application.studyDegree}}/g, mockTutorApplication.studyDegree)
    .replace(/{{application.studyProgram}}/g, mockTutorApplication.studyProgram)
    .replace(/{{application.currentSemester}}/g, mockTutorApplication.currentSemester.toString())
    .replace(/{{application.devices}}/g, mockTutorApplication.devices.join(', '))
    .replace(/{{application.coursesTaken}}/g, mockTutorApplication.coursesTaken.join(', '))
    .replace(
      /{{application.germanLanguageProficiency}}/g,
      mockTutorApplication.germanLanguageProficiency,
    )
    .replace(
      /{{application.englishLanguageProficiency}}/g,
      mockTutorApplication.englishLanguageProficiency,
    )
    .replace(/{{application.motivation}}/g, mockTutorApplication.motivation)
    .replace(/{{application.experience}}/g, mockTutorApplication.experience)
    .replace(/{{application.reasonGoodTutor}}/g, mockTutorApplication.reasonGoodTutor)
}

const courseIterationElements = [
  {
    accessor: 'course.id',
    description: 'Course ID',
  },
  {
    accessor: 'course.semesterName',
    description: 'Semester name of the current course iteration',
  },
  {
    accessor: 'course.iosTag',
    description: 'iOS tag used for the current semester',
  },
  {
    accessor: 'course.coachInterviewDate',
    description: 'Interview date for coaches',
  },
  {
    accessor: 'course.tutorInterviewDate',
    description: 'Interview date for tutors',
  },
  {
    accessor: 'course.coachInterviewLocation',
    description: 'Interview location for coaches',
  },
  {
    accessor: 'course.tutorInterviewLocation',
    description: 'Interview location for tutors',
  },
  {
    accessor: 'course.coachInterviewPlannerLink',
    description: 'Interview planner link for coaches',
  },
  {
    accessor: 'course.tutorInterviewPlannerLink',
    description: 'Interview planner link for tutors',
  },
]

const studentElements = [
  { accessor: 'student.publicId', description: "Student's public ID" },
  { accessor: 'student.firstName', description: "Student's first name" },
  { accessor: 'student.lastName', description: "Student's last name" },
  { accessor: 'student.email', description: "Student's email" },
  { accessor: 'student.tumId', description: "Student's TUM ID" },
  {
    accessor: 'student.matriculationNumber',
    description: "Student's matriculation number",
  },
  { accessor: 'student.gender', description: "Student's gender" },
  { accessor: 'student.nationality', description: "Student's nationality" },
  {
    accessor: 'student.isExchangeStudent',
    description: 'Boolean value indicating whether the referred student is an exchange student',
  },
]

const thesisAdvisorElements = [
  { accessor: 'advisor.firstName', description: "Advisor's first name" },
  { accessor: 'advisor.lastName', description: "Advisor's last name" },
  { accessor: 'advisor.email', description: "Advisor's email" },
  { accessor: 'advisor.tumId', description: "Advisors's TUM ID" },
]

const thesisApplicationElements = [
  {
    accessor: 'application.currentSemester',
    description: 'Current semester in which the referred student submitted the application',
  },
  {
    accessor: 'application.studyDegree',
    description: "Student's study degree",
  },
  {
    accessor: 'application.studyProgram',
    description: "Student's study program",
  },
  {
    accessor: 'application.thesisTitle',
    description: 'Thesis title suggestion',
  },
  {
    accessor: 'application.desiredThesisStart',
    description: 'Desired start date of the thesis',
  },
  {
    accessor: 'application.interests',
    description: 'Interests stated by the referred student',
  },
  {
    accessor: 'application.projects',
    description: 'Projects the referred student states to have been working on',
  },
  {
    accessor: 'application.specialSkills',
    description: "Student's special skills",
  },
  {
    accessor: 'application.motivation',
    description: 'Motivation for the thesis application',
  },
  {
    accessor: 'application.researchAreas',
    description: 'Research areas stated by the referred student',
  },
  {
    accessor: 'application.focusTopics',
    description: 'Focus topics stated by the referred student',
  },
]

const developerApplicationElements = [
  {
    accessor: 'application.currentSemester',
    description: 'Current semester in which the referred student submitted the application',
  },
  {
    accessor: 'application.studyDegree',
    description: "Student's study degree",
  },
  {
    accessor: 'application.studyProgram',
    description: "Student's study program",
  },
  {
    accessor: 'application.germanLanguageProficiency',
    description: 'German language proficiency',
  },
  {
    accessor: 'application.englishLanguageProficiency',
    description: 'English language proficiency',
  },
  {
    accessor: 'application.devices',
    description: 'Devices the referred student states to have in posession',
  },
  {
    accessor: 'application.coursesTaken',
    description: 'Courses the referred student states to have taken',
  },
  { accessor: 'application.experience', description: "Student's experience" },
  { accessor: 'application.motivation', description: "Student's motivation" },
]

const coachApplicationElements = [
  {
    accessor: 'application.currentSemester',
    description: 'Current semester in which the referred student submitted the application',
  },
  {
    accessor: 'application.studyDegree',
    description: "Student's study degree",
  },
  {
    accessor: 'application.studyProgram',
    description: "Student's study program",
  },
  {
    accessor: 'application.germanLanguageProficiency',
    description: 'German language proficiency',
  },
  {
    accessor: 'application.englishLanguageProficiency',
    description: 'English language proficiency',
  },
  {
    accessor: 'application.devices',
    description: 'Devices the referred student states to have in posession',
  },
  {
    accessor: 'application.coursesTaken',
    description: 'Courses the referred student states to have taken',
  },
  { accessor: 'application.experience', description: "Student's experience" },
  { accessor: 'application.motivation', description: "Student's motivation" },
  {
    accessor: 'application.solvedProblem',
    description:
      'Problem the referred student stated to habe solved when previously participating in the course',
  },
]

const tutorApplicationElements = [
  {
    accessor: 'application.currentSemester',
    description: 'Current semester in which the referred student submitted the application',
  },
  {
    accessor: 'application.studyDegree',
    description: "Student's study degree",
  },
  {
    accessor: 'application.studyProgram',
    description: "Student's study program",
  },
  {
    accessor: 'application.germanLanguageProficiency',
    description: 'German language proficiency',
  },
  {
    accessor: 'application.englishLanguageProficiency',
    description: 'English language proficiency',
  },
  {
    accessor: 'application.devices',
    description: 'Devices the referred student states to have in posession',
  },
  {
    accessor: 'application.coursesTaken',
    description: 'Courses the referred student states to have taken',
  },
  { accessor: 'application.experience', description: "Student's experience" },
  { accessor: 'application.motivation', description: "Student's motivation" },
  {
    accessor: 'application.reasonGoodTutor',
    description: 'Reason for being a good tutor candidate as perceived by the referred student',
  },
]

export const ThesisApplicationAndStudentInstructions = (): JSX.Element => {
  const rows = [...studentElements, ...thesisApplicationElements].map((element) => (
    <tr key={element.accessor}>
      <td>{element.accessor}</td>
      <td>{element.description}</td>
    </tr>
  ))

  return (
    <Table verticalSpacing='xs' fz='xs'>
      <thead>
        <tr>
          <th>Accessor</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}

export const ThesisApplicationAndStudentAndThesisAdvisorInstructions = (): JSX.Element => {
  const rows = [...studentElements, ...thesisApplicationElements, ...thesisAdvisorElements].map(
    (element) => (
      <tr key={element.accessor}>
        <td>{element.accessor}</td>
        <td>{element.description}</td>
      </tr>
    ),
  )

  return (
    <Table verticalSpacing='xs' fz='xs'>
      <thead>
        <tr>
          <th>Accessor</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}

export const StudentAndCourseIterationInstructions = (): JSX.Element => {
  const rows = [...studentElements, ...courseIterationElements].map((element) => (
    <tr key={element.accessor}>
      <td>{element.accessor}</td>
      <td>{element.description}</td>
    </tr>
  ))

  return (
    <Table verticalSpacing='xs' fz='xs'>
      <thead>
        <tr>
          <th>Accessor</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}

export const StudentAndCourseIterationAndDeveloperApplicationInstructions = (): JSX.Element => {
  const rows = [
    ...studentElements,
    ...courseIterationElements,
    ...developerApplicationElements,
  ].map((element) => (
    <tr key={element.accessor}>
      <td>{element.accessor}</td>
      <td>{element.description}</td>
    </tr>
  ))

  return (
    <Table verticalSpacing='xs' fz='xs'>
      <thead>
        <tr>
          <th>Accessor</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}

export const StudentAndCourseIterationAndCoachApplicationInstructions = (): JSX.Element => {
  const rows = [...studentElements, ...courseIterationElements, ...coachApplicationElements].map(
    (element) => (
      <tr key={element.accessor}>
        <td>{element.accessor}</td>
        <td>{element.description}</td>
      </tr>
    ),
  )

  return (
    <Table verticalSpacing='xs' fz='xs'>
      <thead>
        <tr>
          <th>Accessor</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}

export const StudentAndCourseIterationAndTutorApplicationInstructions = (): JSX.Element => {
  const rows = [...studentElements, ...courseIterationElements, ...tutorApplicationElements].map(
    (element) => (
      <tr key={element.accessor}>
        <td>{element.accessor}</td>
        <td>{element.description}</td>
      </tr>
    ),
  )

  return (
    <Table verticalSpacing='xs' fz='xs'>
      <thead>
        <tr>
          <th>Accessor</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>{rows}</tbody>
    </Table>
  )
}
