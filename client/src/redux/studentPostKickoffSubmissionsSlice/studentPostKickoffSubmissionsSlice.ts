import { createSlice } from '@reduxjs/toolkit'
import { deleteStudentProjectTeamPreferences } from './thunks/deleteStudentProjectTeamPreferences'
import { type Student } from '../applicationsSlice/applicationsSlice'
import { createStudentPostKickoffSubmission } from './thunks/createStudentPostKickoffSubmission'
import { fetchStudentPostKickoffSubmissions } from './thunks/fetchStudentPostKickoffSubmissions'
import { type Skill } from '../skillsSlice/skillsSlice'

enum SkillProficiency {
  BEGINNER = 'Beginner',
  INTERMEDIATE = 'Intermediate',
  ADVANCED = 'Advanced',
  EXPERT = 'Expert',
}

enum SkillAssessmentSource {
  STUDENT = 'STUDENT',
  TUTOR = 'TUTOR',
  MGMT = 'MGMT',
}

interface StudentSkill {
  id?: string
  skill: Skill
  skillAssessmentSource: SkillAssessmentSource
  skillProficiency: SkillProficiency
}

interface StudentProjectTeamPreference {
  projectTeamId: string
  priorityScore: number
}

interface StudentPostKickoffSubmission {
  id?: string
  student?: Student
  appleId: string
  macBookDeviceId?: string
  iPhoneDeviceId?: string
  iPadDeviceId?: string
  appleWatchDeviceId?: string
  studentProjectTeamPreferences: StudentProjectTeamPreference[]
  reasonForFirstChoice: string
  reasonForLastChoice: string
  selfReportedExperienceLevel: SkillProficiency
  studentSkills: StudentSkill[]
}

interface StudentPostKickoffSubmissionsSliceState {
  status: string
  error: string | null
  studentPostKickoffSubmissions: StudentPostKickoffSubmission[]
}

const initialState: StudentPostKickoffSubmissionsSliceState = {
  status: 'idle',
  error: null,
  studentPostKickoffSubmissions: [],
}

export const studentPostKickoffSubmissionsSlice = createSlice({
  name: 'studentPostKickoffSubmissions',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchStudentPostKickoffSubmissions.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(fetchStudentPostKickoffSubmissions.fulfilled, (state, { payload }) => {
      state.studentPostKickoffSubmissions = payload
      state.status = 'idle'
    })

    builder.addCase(fetchStudentPostKickoffSubmissions.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(createStudentPostKickoffSubmission.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(createStudentPostKickoffSubmission.fulfilled, (state, { payload }) => {
      state.studentPostKickoffSubmissions.push(payload)
      state.status = 'idle'
    })

    builder.addCase(createStudentPostKickoffSubmission.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })

    builder.addCase(deleteStudentProjectTeamPreferences.pending, (state) => {
      state.status = 'loading'
      state.error = null
    })

    builder.addCase(deleteStudentProjectTeamPreferences.fulfilled, (state, { payload }) => {
      state.studentPostKickoffSubmissions = payload
      state.status = 'idle'
    })

    builder.addCase(deleteStudentProjectTeamPreferences.rejected, (state, { payload }) => {
      if (payload) state.error = 'error'
      state.status = 'idle'
    })
  },
})

export default studentPostKickoffSubmissionsSlice.reducer
export {
  type StudentProjectTeamPreference,
  type StudentPostKickoffSubmission,
  type StudentSkill,
  SkillProficiency,
  SkillAssessmentSource,
}
