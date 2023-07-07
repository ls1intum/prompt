import { createSlice } from '@reduxjs/toolkit'
import { type ProjectTeam } from '../projectTeamsSlice/projectTeamsSlice'
import { assignDeveloperApplicationToProjectTeam } from './thunks/assignDeveloperApplicationToProjectTeam'
import {
  createInstructorCommentForDeveloperApplication,
  createInstructorCommentForCoachApplication,
  createInstructorCommentForTutorApplication,
} from './thunks/createInstructorComment'
import {
  fetchDeveloperApplications,
  fetchCoachApplications,
  fetchTutorApplications,
} from './thunks/fetchApplications'
import { removeDeveloperApplicationFromProjectTeam } from './thunks/removeDeveloperApplicationFromProjectTeam'
import { updateDeveloperApplication } from './thunks/updateDeveloperApplication'
import {
  updateCoachApplicationAssessment,
  updateDeveloperApplicationAssessment,
  updateTutorApplicationAssessment,
} from './thunks/updateApplicationAssessment'
import {
  deleteCoachApplication,
  deleteDeveloperApplication,
  deleteTutorApplication,
} from './thunks/deleteApplication'
import { assignTechnicalChallengeScores } from './thunks/assignTechnicalChallengeScores'
import { updateStudent } from './thunks/updateStudent'

enum LanguageProficiency {
  A1A2 = 'A1/A2',
  B1B2 = 'B1/B2',
  C1C2 = 'C1/C2',
  NATIVE = 'Native',
}

enum StudyDegree {
  BACHELOR = 'Bachelor',
  MASTER = 'Master',
}

enum StudyProgram {
  COMPUTER_SCIENCE = 'Computer Science',
  INFORMATION_SYSTEMS = 'Information Systems',
  GAMES_ENGINEERING = 'Games Engineering',
  MANAGEMENT_AND_TECHNOLOGY = 'Management and Technology',
  OTHER = 'Other',
}

enum Gender {
  MALE = 'Male',
  FEMALE = 'Female',
  OTHER = 'Other',
  PREFER_NOT_TO_SAY = 'Prefer not to say',
}

enum Device {
  MACBOOK = 'Mac',
  IPHONE = 'IPhone',
  IPAD = 'IPad',
  APPLE_WATCH = 'Watch',
  RASPBERRY_PI = 'Raspberry PI',
}

enum Course {
  ITSE = 'Introduction to Software Engineering (IN0006)',
  PISE = 'Patterns in Software Engineering (IN2081)',
  ITP = 'Introduction to Programming (CIT5230000)',
  IPRAKTIKUM = 'iPraktikum (IN0012, IN2106, IN2128)',
  JASS = 'Joint Advanced Student School',
  FK = 'Ferienakademie',
  THESIS = 'Thesis',
}

interface Student {
  id: string
  tumId?: string
  matriculationNumber?: string
  isExchangeStudent: boolean
  firstName?: string
  lastName?: string
  gender?: Gender
  nationality?: string
  email?: string
  suggestedAsCoach: boolean
  suggestedAsTutor: boolean
  blockedByPm: boolean
  reasonForBlockedByPm: string
}

interface ApplicationAssessment {
  instructorComments: InstructorComment[]
  assessmentScore: number
  technicalChallengeScore: number
  assessed: boolean
  accepted: boolean
}

interface Application {
  id: string
  student: Student
  studyDegree?: StudyDegree
  currentSemester?: string
  studyProgram?: StudyProgram
  englishLanguageProficiency?: LanguageProficiency
  germanLanguageProficiency?: LanguageProficiency
  motivation?: string
  experience?: string
  devices: Device[]
  coursesTaken: Course[]
  assessment?: ApplicationAssessment
}

interface DeveloperApplication extends Application {
  projectTeam?: ProjectTeam
}

interface CoachApplication extends Application {
  solvedProblem: string
  projectTeam?: ProjectTeam
}

interface TutorApplication extends Application {
  reasonGoodTutor: string
}

interface InstructorComment {
  id?: string
  author: string
  timestamp?: string
  text: string
}

interface StudentApplicationSliceState {
  status: string
  error: string | null
  developerApplications: DeveloperApplication[]
  coachApplications: CoachApplication[]
  tutorApplications: TutorApplication[]
}

const initialState: StudentApplicationSliceState = {
  status: 'idle',
  error: null,
  developerApplications: [],
  coachApplications: [],
  tutorApplications: [],
}

export const applicationsState = createSlice({
  name: 'applications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchDeveloperApplications.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchDeveloperApplications.fulfilled, (state, { payload }) => {
      state.developerApplications = payload
      state.status = 'idle'
    })

    builder.addCase(fetchDeveloperApplications.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(fetchCoachApplications.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchCoachApplications.fulfilled, (state, { payload }) => {
      state.coachApplications = payload
      state.status = 'idle'
    })

    builder.addCase(fetchCoachApplications.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(fetchTutorApplications.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchTutorApplications.fulfilled, (state, { payload }) => {
      state.tutorApplications = payload
      state.status = 'idle'
    })

    builder.addCase(fetchTutorApplications.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(updateStudent.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(updateStudent.fulfilled, (state, { payload }) => {
      state.developerApplications = state.developerApplications.map((developerApplication) =>
        developerApplication.student.id === payload.id
          ? { ...developerApplication, student: payload }
          : developerApplication,
      )
      state.coachApplications = state.coachApplications.map((coachApplication) =>
        coachApplication.student.id === payload.id
          ? { ...coachApplication, student: payload }
          : coachApplication,
      )
      state.tutorApplications = state.tutorApplications.map((tutorApplication) =>
        tutorApplication.student.id === payload.id
          ? { ...tutorApplication, student: payload }
          : tutorApplication,
      )
      state.status = 'idle'
    })

    builder.addCase(updateStudent.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(updateDeveloperApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(updateDeveloperApplication.fulfilled, (state, { payload }) => {
      state.developerApplications = state.developerApplications.map((studentApplication) =>
        studentApplication.id === payload.id ? payload : studentApplication,
      )
      state.status = 'idle'
    })

    builder.addCase(updateDeveloperApplication.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(updateDeveloperApplicationAssessment.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(updateDeveloperApplicationAssessment.fulfilled, (state, { payload }) => {
      state.developerApplications = state.developerApplications.map((studentApplication) =>
        studentApplication.id === payload.id ? payload : studentApplication,
      )
      state.status = 'idle'
    })

    builder.addCase(updateDeveloperApplicationAssessment.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(updateCoachApplicationAssessment.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(updateCoachApplicationAssessment.fulfilled, (state, { payload }) => {
      state.coachApplications = state.coachApplications.map((studentApplication) =>
        studentApplication.id === payload.id ? payload : studentApplication,
      )
      state.status = 'idle'
    })

    builder.addCase(updateCoachApplicationAssessment.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(updateTutorApplicationAssessment.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(updateTutorApplicationAssessment.fulfilled, (state, { payload }) => {
      state.tutorApplications = state.tutorApplications.map((studentApplication) =>
        studentApplication.id === payload.id ? payload : studentApplication,
      )
      state.status = 'idle'
    })

    builder.addCase(updateTutorApplicationAssessment.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(assignTechnicalChallengeScores.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(assignTechnicalChallengeScores.fulfilled, (state, { payload }) => {
      state.developerApplications = state.developerApplications.map((sa) => {
        return (
          payload
            .filter(
              (updatedDeveloperApplication: DeveloperApplication) =>
                updatedDeveloperApplication.id === sa.id,
            )
            .at(0) ?? sa
        )
      })
      state.status = 'idle'
    })

    builder.addCase(assignTechnicalChallengeScores.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createInstructorCommentForDeveloperApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(
      createInstructorCommentForDeveloperApplication.fulfilled,
      (state, { payload }) => {
        state.developerApplications.map((sa) => {
          return sa.id === payload.id ? payload : sa
        })
        state.status = 'idle'
      },
    )

    builder.addCase(
      createInstructorCommentForDeveloperApplication.rejected,
      (state, { payload }) => {
        if (payload) state.error = 'error'
        state.status = 'idle'
      },
    )

    builder.addCase(createInstructorCommentForCoachApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createInstructorCommentForCoachApplication.fulfilled, (state, { payload }) => {
      state.coachApplications.map((sa) => {
        return sa.id === payload.id ? payload : sa
      })
      state.status = 'idle'
    })

    builder.addCase(createInstructorCommentForCoachApplication.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createInstructorCommentForTutorApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createInstructorCommentForTutorApplication.fulfilled, (state, { payload }) => {
      state.tutorApplications.map((sa) => {
        return sa.id === payload.id ? payload : sa
      })
      state.status = 'idle'
    })

    builder.addCase(createInstructorCommentForTutorApplication.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(assignDeveloperApplicationToProjectTeam.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(assignDeveloperApplicationToProjectTeam.fulfilled, (state, { payload }) => {
      state.developerApplications = state.developerApplications.map((studentApplication) =>
        studentApplication.id === payload.id ? payload : studentApplication,
      )
      state.status = 'idle'
    })

    builder.addCase(assignDeveloperApplicationToProjectTeam.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(removeDeveloperApplicationFromProjectTeam.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(removeDeveloperApplicationFromProjectTeam.fulfilled, (state, { payload }) => {
      state.developerApplications = state.developerApplications.map((studentApplication) =>
        studentApplication.id === payload.id ? payload : studentApplication,
      )
      state.status = 'idle'
    })

    builder.addCase(removeDeveloperApplicationFromProjectTeam.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(deleteDeveloperApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(deleteDeveloperApplication.fulfilled, (state, { payload }) => {
      state.developerApplications = state.developerApplications.filter(
        (developerApplication) => developerApplication.id !== payload,
      )
      state.status = 'idle'
    })

    builder.addCase(deleteDeveloperApplication.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(deleteCoachApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(deleteCoachApplication.fulfilled, (state, { payload }) => {
      state.coachApplications = state.coachApplications.filter(
        (coachApplication) => coachApplication.id !== payload,
      )
      state.status = 'idle'
    })

    builder.addCase(deleteCoachApplication.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(deleteTutorApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(deleteTutorApplication.fulfilled, (state, { payload }) => {
      state.tutorApplications = state.tutorApplications.filter(
        (tutorApplication) => tutorApplication.id !== payload,
      )
      state.status = 'idle'
    })

    builder.addCase(deleteTutorApplication.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

// export const {} = studentApplicationsState.actions
export default applicationsState.reducer
export {
  type Student,
  type Application,
  type DeveloperApplication,
  type CoachApplication,
  type TutorApplication,
  type InstructorComment,
  type ApplicationAssessment,
  LanguageProficiency,
  StudyDegree,
  StudyProgram,
  Gender,
  Device,
  Course,
}
