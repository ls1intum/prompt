import { createSlice } from '@reduxjs/toolkit'
import {
  type StudyDegree,
  type Student,
  type StudyProgram,
} from '../applicationsSlice/applicationsSlice'

enum TopicArea {
  AUTOMOTIVE = 'Automotive',
  BLOCKCHAIN = 'Blockchain',
  CYBER_PHYSICAL_SYSTEMS = 'Cyber-Physical Systems',
  FORMAL_METHODS_AND_MODELS = 'Formal Methods and Models',
  MACHINE_LEARNING = 'Machine Learning',
  PRIVACY = 'Privacy',
  SECURITY = 'Security',
  SMART_CONTRACTS = 'Smart Contracts',
  SOFTWARE_QUALITY = 'Software Quality',
  SOFTWARE_TESTING = 'Software Testing',
}

interface ThesisApplication {
  id: string
  student: Student
  studyProgram?: StudyProgram
  studyDegree?: StudyDegree
  currentSemester?: string
  start: string
  thesisTitle: string
  specialSkills: string
  topicAreas: TopicArea[]
  motivation: string
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
  extraReducers: (builder) => {},
})

export default thesisApplicationsSlice.reducer
export { type ThesisApplication, TopicArea }
