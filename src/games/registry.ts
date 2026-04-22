import type { ComponentType } from 'react'
import { Connect4Game } from './connect4/Connect4Game'
import { PacmanGame } from './pacman/PacmanGame'
import { PongGame } from './pong/PongGame'
import { TetrisGame } from './tetris/TetrisGame'

export type GameId = 'tetris' | 'pacman' | 'pong' | 'connect4'

type GameMeta = {
  id: GameId
  name: string
  description: string
  component: ComponentType
}

export const gameRegistry: GameMeta[] = [
  { id: 'tetris', name: 'Tetris', description: 'Stack blocks and clear lines.', component: TetrisGame },
  { id: 'pacman', name: 'Pacman', description: 'Eat pellets and avoid ghosts.', component: PacmanGame },
  { id: 'pong', name: 'Pong', description: 'Classic paddle duel vs CPU.', component: PongGame },
  { id: 'connect4', name: '4 Gewinnt', description: 'Drop tokens and connect four.', component: Connect4Game },
]

export const gameById = new Map(gameRegistry.map((game) => [game.id, game]))
