import { create } from 'zustand'
import { ProjectTeam } from '../../redux/projectTeamsSlice/projectTeamsSlice'

interface ProjectTeamStoreState {
  projectTeams: ProjectTeam[]
}

interface ProjectTeamStoreAction {
  setProjectTeams: (projectTeams: ProjectTeam[]) => void
}

export const useProjectTeamStore = create<ProjectTeamStoreState & ProjectTeamStoreAction>(
  (set) => ({
    projectTeams: [],
    setProjectTeams: (projectTeams) => set({ projectTeams: projectTeams }),
  }),
)
