import { create } from 'zustand'
import { Application } from '../../interface/application'

interface ApplicationStoreState {
  developerApplications: Application[]
  coachApplications: Application[]
  tutorApplications: Application[]
}

interface ApplicationStoreAction {
  setDeveloperApplications: (applications: Application[]) => void
  setCoachApplications: (applications: Application[]) => void
  setTutorApplications: (applications: Application[]) => void
  getDeveloperApplications: (status: string) => Application[]
}

export const useApplicationStore = create<ApplicationStoreState & ApplicationStoreAction>(
  (set, get) => ({
    developerApplications: [],
    coachApplications: [],
    tutorApplications: [],
    setDeveloperApplications: (applications) => set({ developerApplications: applications }),
    setCoachApplications: (applications) => set({ coachApplications: applications }),
    setTutorApplications: (applications) => set({ tutorApplications: applications }),
    getDeveloperApplications: (status: string) => {
      const { developerApplications } = get()
      return developerApplications.filter((application) => application.assessment.status === status)
    },
  }),
)
