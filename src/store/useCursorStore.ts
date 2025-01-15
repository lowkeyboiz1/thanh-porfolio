// src/store/useCursorStore.ts
import { create } from 'zustand'

interface CursorState {
  isCursorVisible: boolean
  toggleCursor: (visible: boolean) => void
}

export const useCursorStore = create<CursorState>((set) => ({
  isCursorVisible: false,
  toggleCursor: (visible: boolean) => set(() => ({ isCursorVisible: visible }))
}))
