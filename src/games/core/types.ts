export type GameStatus = 'idle' | 'running' | 'paused' | 'won' | 'lost'

export type GameAction =
  | 'MOVE_LEFT'
  | 'MOVE_RIGHT'
  | 'MOVE_UP'
  | 'MOVE_DOWN'
  | 'ROTATE'
  | 'DROP'
  | 'SELECT'
  | 'PAUSE'

export type GameSnapshot = {
  score: number
  lives?: number
  level?: number
  status: GameStatus
  message?: string
}

export interface GameAdapter {
  init: () => void
  update: (deltaMs: number) => void
  render: (ctx: CanvasRenderingContext2D) => void
  handleInput: (action: GameAction) => void
  getSnapshot: () => GameSnapshot
  reset: () => void
  pause: (paused: boolean) => void
}
