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
  setSelectedCourseIteration: (courseIteration) => {
    if (courseIteration) {
      localStorage.setItem('course-iteration', courseIteration.id)
    } else {
      localStorage.removeItem('course-iteration')
    }

    return set({ selectedCourseIteration: courseIteration })
  },
  setCourseIterations: (courseIterations) => set({ courseIterations: courseIterations }),
}))
