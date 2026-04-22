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
  themeClass: string
}

export const gameRegistry: GameMeta[] = [
  {
    id: 'tetris',
    name: 'Tetris',
    description: 'Stapple die blöcke und lösche die reihen',
    component: TetrisGame,
    themeClass: 'game-theme-tetris',
  },
  {
    id: 'pacman',
    name: 'Pacman',
    description: 'Iss alle Punkte und weiche den Geistern aus.',
    component: PacmanGame,
    themeClass: 'game-theme-pacman',
  },
  {
    id: 'pong',
    name: 'Pong',
    description: 'Klassisches Schläger-Duell game',
    component: PongGame,
    themeClass: 'game-theme-pong',
  },
  {
    id: 'connect4',
    name: '4 Gewinnt',
    description: 'Lass die kreise fallen und verbinde vier',
    component: Connect4Game,
    themeClass: 'game-theme-connect4',
  },
]

export const gameById = new Map(gameRegistry.map((game) => [game.id, game]))
