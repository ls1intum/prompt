import { create } from 'zustand'
import { StudentPostKickoffSubmission } from '../../interface/postKickOffSubmission'

interface PostKickOffSubmissionStoreState {
  postKickOffSubmissions: StudentPostKickoffSubmission[]
}

interface PostKickOffSubmissionStoreAction {
  setPostKickOffSubmissions: (postKickOffSubmissions: StudentPostKickoffSubmission[]) => void
}

export const usePostKickOffSubmissionStore = create<
  PostKickOffSubmissionStoreState & PostKickOffSubmissionStoreAction
>((set) => ({
  postKickOffSubmissions: [],
  setPostKickOffSubmissions: (postKickOffSubmissions) =>
    set({ postKickOffSubmissions: postKickOffSubmissions }),
}))
