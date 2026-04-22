import { create } from 'zustand'

export type Difficulty = 'easy' | 'normal' | 'hard'
export type Language = 'en' | 'de'

type AppState = {
  soundEnabled: boolean
  difficulty: Difficulty
  language: Language | null
  setSoundEnabled: (enabled: boolean) => void
  setDifficulty: (difficulty: Difficulty) => void
  setLanguage: (language: Language) => void
}

export const useAppStore = create<AppState>((set) => ({
  soundEnabled: true,
  difficulty: 'normal',
  language: null,
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setDifficulty: (difficulty) => set({ difficulty }),
  setLanguage: (language) => set({ language }),
}))
