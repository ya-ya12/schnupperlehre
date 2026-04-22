import { create } from 'zustand'

export type Difficulty = 'easy' | 'normal' | 'hard'

type AppState = {
  soundEnabled: boolean
  difficulty: Difficulty
  setSoundEnabled: (enabled: boolean) => void
  setDifficulty: (difficulty: Difficulty) => void
}

export const useAppStore = create<AppState>((set) => ({
  soundEnabled: true,
  difficulty: 'normal',
  setSoundEnabled: (enabled) => set({ soundEnabled: enabled }),
  setDifficulty: (difficulty) => set({ difficulty }),
}))
