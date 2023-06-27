import { createSlice } from '@reduxjs/toolkit'
import { type ProjectTeam } from '../projectTeamsSlice/projectTeamsSlice'
import { assignDeveloperApplicationToProjectTeam } from './thunks/assignDeveloperApplicationToProjectTeam'
import { createDeveloperApplication } from './thunks/createDeveloperApplication'
import { createInstructorComment } from './thunks/createInstructorComment'
import { fetchDeveloperApplications } from './thunks/fetchDeveloperApplications'
import { removeDeveloperApplicationFromProjectTeam } from './thunks/removeDeveloperApplicationFromProjectTeam'
import { updateDeveloperApplication } from './thunks/updateDeveloperApplication'
import { updateDeveloperApplicationAssessment } from './thunks/updateDeveloperApplicationAssessment'
import { fetchCoachApplications } from './thunks/fetchCoachApplications'
import { fetchTutorApplications } from './thunks/fetchTutorApplications'

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
  ITSE = 'Introduction to Software Engineering',
  PISE = 'Patterns in Software Engineering',
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
}

interface ApplicationAssessment {
  instructorComments: InstructorComment[]
  suggestedAsCoach: boolean
  suggestedAsTutor: boolean
  blockedByPM: boolean
  reasonForBlockedByPM: string
  assessmentScore: number
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
  assessment: ApplicationAssessment
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

export const studentApplicationsState = createSlice({
  name: 'studentApplications',
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

    builder.addCase(createDeveloperApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createDeveloperApplication.fulfilled, (state, { payload }) => {
      state.developerApplications.push(payload)
      state.status = 'idle'
    })

    builder.addCase(createDeveloperApplication.rejected, (state, { payload }) => {
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

    builder.addCase(createInstructorComment.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createInstructorComment.fulfilled, (state, { payload }) => {
      state.developerApplications.map((sa) => {
        return sa.id === payload.id ? payload : sa
      })
      state.status = 'idle'
    })

    builder.addCase(createInstructorComment.rejected, (state, { payload }) => {
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
  },
})

// export const {} = studentApplicationsState.actions
export default studentApplicationsState.reducer
export {
  type Student,
  type Application,
  type DeveloperApplication,
  type CoachApplication,
  type TutorApplication,
  type InstructorComment,
  LanguageProficiency,
  StudyDegree,
  StudyProgram,
  Gender,
  Device,
  Course,
}
