import { create } from 'zustand'
import { Skill } from '../../interface/skill'

interface SkillStoreState {
  skills: Skill[]
}

interface SkillStoreAction {
  setSkills: (skills: Skill[]) => void
}

export const useSkillStore = create<SkillStoreState & SkillStoreAction>((set) => ({
  skills: [],
  setSkills: (skills) => set({ skills: skills }),
}))
