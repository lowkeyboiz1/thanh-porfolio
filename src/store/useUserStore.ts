// src/store/useUser.ts
import { create } from 'zustand'

interface UserState {
  user: null
  setUser: (user: UserState['user']) => void
}

export const useUserStore = create<UserState>((set) => ({
  user: null,
  setUser: (user) => set(() => ({ user }))
}))
