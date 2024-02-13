import { create } from 'zustand'
import { IntroCourseParticipation } from '../../interface/introCourse'
import { Student } from '../../interface/application'

interface IntroCourseStoreState {
  participations: IntroCourseParticipation[]
  tutors: Student[]
}

interface IntroCourseStoreAction {
  setParticipations: (participations: IntroCourseParticipation[]) => void
  setTutors: (tutors: Student[]) => void
}

export const useIntroCourseStore = create<IntroCourseStoreState & IntroCourseStoreAction>(
  (set) => ({
    participations: [],
    tutors: [],
    setParticipations: (participations) => set({ participations: participations }),
    setTutors: (tutors) => set({ tutors: tutors }),
  }),
)
