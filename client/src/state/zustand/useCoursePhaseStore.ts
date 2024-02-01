import { create } from 'zustand'
import { CoursePhase } from '../../interface/coursePhase'

interface CoursePhaseStoreState {
  coursePhases: CoursePhase[]
}

interface CoursePhaseStoreAction {
  setCoursePhases: (coursePhases: CoursePhase[]) => void
}

export const useCoursePhaseStore = create<CoursePhaseStoreState & CoursePhaseStoreAction>(
  (set) => ({
    coursePhases: [],
    setCoursePhases: (coursePhases) => set({ coursePhases: coursePhases }),
  }),
)
