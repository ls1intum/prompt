import axios from 'axios'

interface Student {
  id: ''
  tumId: string
  matriculationNumber: string
  isExchangeStudent: boolean
  firstName: string
  lastName: string
  gender: string
  nationality: string
  email: string
}

interface StudentApplication {
  id: string
  student: Student
  studyDegree: string
  currentSemester: string
  studyProgram: string
  motivation: string
  experience: string
  notes: Note[]
}

interface Note {
  id?: string
  author: User
  timestamp?: string
  comment: string
}

interface User {
  id: string
  username?: string
}

const fetchStudentApplications = async (): Promise<[StudentApplication] | undefined> => {
  try {
    return (
      await axios.get('http://localhost:8080/api/student-applications', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
        },
      })
    ).data
  } catch (err) {
    console.log(err)
    return undefined
  }
}

const postStudentApplication = async (
  studentApplication: StudentApplication,
): Promise<StudentApplication | undefined> => {
  try {
    return (await axios.post('http://localhost:8080/api/student-applications', studentApplication))
      .data
  } catch (err) {
    console.log(err)
    return undefined
  }
}

const postStudentApplicationNote = async (
  studentApplicationId: string,
  studentApplicationNote: Note,
): Promise<StudentApplication | undefined> => {
  try {
    return (
      await axios.post(
        `http://localhost:8080/api/student-applications/${studentApplicationId}/notes`,
        studentApplicationNote,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('jwt_token') ?? ''}`,
          },
        },
      )
    ).data
  } catch (err) {
    console.log(err)
    return undefined
  }
}

export {
  type StudentApplication,
  fetchStudentApplications,
  postStudentApplication,
  postStudentApplicationNote,
}
