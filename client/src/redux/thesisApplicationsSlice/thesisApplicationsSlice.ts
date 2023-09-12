import { createSlice } from '@reduxjs/toolkit'
import {
  type StudyDegree,
  type Student,
  type StudyProgram,
  type ApplicationStatus,
} from '../applicationsSlice/applicationsSlice'
import { fetchThesisApplications } from './thunks/fetchThesisApplications'
import { assessThesisApplication } from './thunks/assessThesisApplication'

enum ResearchArea {
  EDUCATION_TECHNOLOGIES = 'Education Technologies',
  HUMAN_COMPUTER_INTERACTION = 'Human Computer Interaction',
  ROBOTIC = 'Robotic',
  SOFTWARE_ENGINEERING = 'Software Engineering',
}

enum FocusTopic {
  COMPETENCIES = 'Competencies',
  TEAM_BASED_LEARNING = 'Team-based Learning',
  AUTOMATIC_ASSESSMENT = 'Automatic Assessment',
  LEARNING_PLATFORMS = 'Learning Platforms',
  MACHINE_LEARNING = 'Machine Learning',
  DEI = 'Diversity, Equity & Inclusion',
  LEARNING_ANALYTICS = 'Learning Analytics',
  ADAPTIVE_LEARNING = 'Adaptive Learning',
  K12_SCHOOLS = 'K12 / Schools',
  SECURITY = 'Security',
  INFRASTRUCTURE = 'Infrastructure',
  AGILE_DEVELOPMENT = 'Agile Development',
  MOBILE_DEVELOPMENT = 'Mobile Development',
  CONTINUOUS = 'Continuous *',
  MODELING = 'Modeling',
  INNOVATION = 'Innovation',
  PROJECT_COURSES = 'Project Courses',
  DISTRIBUTED_SYSTEMS = 'Distributed Systems',
  DEPLOYMENT = 'Deployment',
  DEV_OPS = 'DevOps',
  INTERACTION_DESIGN = 'Interaction Design',
  USER_INVOLVEMENT = 'User Involvement',
  USER_EXPERIENCE = 'User Experience',
  CREATIVITY = 'Creativity',
  USER_MODEL = 'User Model',
  INTERACTIVE_TECHNOLOGY = 'Interactive Technology',
  MOCK_UPS = 'Mock-ups',
  PROTOTYPING = 'Prototyping',
  EMBEDDED_SYSTEMS = 'Embedded Systems',
  DUCKIETOWN = 'Duckietown',
  AUTONOMOUS_DRIVING = 'Autonomous Driving',
  COMMUNICATION = 'Communication',
  DISTRIBUTED_CONTROL = 'Distributed Control',
  LEARNING_AUTONOMY = 'Learning Autonomy',
  HW_SW_CO_DESIGN = 'HW/SW Co-Design',
}

interface ThesisApplication {
  id: string
  student: Student
  studyProgram?: StudyProgram
  studyDegree?: StudyDegree
  currentSemester?: string
  start: string
  specialSkills: string
  researchAreas: ResearchArea[]
  focusTopics: FocusTopic[]
  motivation: string
  interests: string
  projects: string
  thesisTitle: string
  desiredThesisStart: Date
  examinationReportFilename?: string
  cvFilename?: string
  bachelorReportFilename?: string
  applicationStatus: keyof typeof ApplicationStatus
  assessmentComment?: string
  createdAt?: Date
}

interface ThesisApplicationsSliceState {
  status: string
  error: string | null
  applications: ThesisApplication[]
}

const initialState: ThesisApplicationsSliceState = {
  status: 'idle',
  error: null,
  applications: [],
}

export const thesisApplicationsSlice = createSlice({
  name: 'thesisApplications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchThesisApplications.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchThesisApplications.fulfilled, (state, { payload }) => {
      state.applications = payload
      state.status = 'idle'
    })

    builder.addCase(fetchThesisApplications.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(assessThesisApplication.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(assessThesisApplication.fulfilled, (state, { payload }) => {
      state.applications = state.applications.map((application) =>
        application.id === payload.id ? payload : application,
      )
      state.status = 'idle'
    })

    builder.addCase(assessThesisApplication.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

export default thesisApplicationsSlice.reducer
export { type ThesisApplication, ResearchArea, FocusTopic }
