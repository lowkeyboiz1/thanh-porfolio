// src/store/useImageStore.ts
import { ImageKitFile } from '@/type'
import { create } from 'zustand'

interface ImageState {
  listImageKits: ImageKitFile[]
  setListImageKits: (listImageKits: ImageKitFile[]) => void
}

export const useImageStore = create<ImageState>((set) => ({
  listImageKits: [],
  setListImageKits: (listImageKits: ImageKitFile[]) => set(() => ({ listImageKits }))
}))
