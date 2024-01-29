import { create } from 'zustand'
import { CourseIteration } from '../../interface/courseIteration'

interface CourseIterationStoreState {
  selectedCourseIteration?: CourseIteration
  courseIterations: CourseIteration[]
}

interface CourseIterationStoreAction {
  setSelectedCourseIteration: (courseIteration?: CourseIteration) => void
  setCourseIterations: (courseIterations: CourseIteration[]) => void
}

export const useCourseIterationStore = create<
  CourseIterationStoreState & CourseIterationStoreAction
>((set) => ({
  courseIterations: [],
  setSelectedCourseIteration: (courseIteration) =>
    set({ selectedCourseIteration: courseIteration }),
  setCourseIterations: (courseIterations) => set({ courseIterations: courseIterations }),
}))
