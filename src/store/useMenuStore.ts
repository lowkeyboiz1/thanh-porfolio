// src/store/useMenuStore.ts
import { create } from 'zustand'

interface MenuState {
  isMenuOpen: boolean
  toggleMenu: (open: boolean) => void
}

export const useMenuStore = create<MenuState>((set) => ({
  isMenuOpen: false,
  toggleMenu: (open: boolean) => set(() => ({ isMenuOpen: open }))
}))
