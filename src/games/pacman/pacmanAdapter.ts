import type { GameAction, GameAdapter, GameSnapshot } from '../core/types'

const TILE = 24
const MAP = [
  '###############',
  '#...#...#...#.#',
  '#.#.#.#.#.#.#.#',
  '#o#...#.#...#o#',
  '#.###.#.#.###.#',
  '#...#...#...#.#',
  '#.#.#.###.#.#.#',
  '#...#.....#...#',
  '###############',
]

type Pos = { x: number; y: number }

export class PacmanAdapter implements GameAdapter {
  private pacman: Pos = { x: 1, y: 1 }
  private ghost: Pos = { x: 13, y: 7 }
  private dir: Pos = { x: 1, y: 0 }
  private status: GameSnapshot['status'] = 'idle'
  private score = 0
  private lives = 3
  private pellets = new Set<string>()
  private speedMs: number
  private difficulty: 'easy' | 'normal' | 'hard'
  private elapsed = 0

  constructor(difficulty: 'easy' | 'normal' | 'hard') {
    this.difficulty = difficulty
    this.speedMs = difficulty === 'easy' ? 180 : difficulty === 'hard' ? 80 : 130
    this.seedPellets()
  }

  private seedPellets() {
    this.pellets.clear()
    for (let y = 0; y < MAP.length; y += 1) {
      for (let x = 0; x < MAP[y].length; x += 1) {
        if (MAP[y][x] === '.' || MAP[y][x] === 'o') this.pellets.add(`${x},${y}`)
      }
    }
  }

  init() {
    this.status = 'running'
  }

  private isWall(pos: Pos) {
    return MAP[pos.y]?.[pos.x] === '#'
  }

  setDirectionFromPointer(pointerX: number, pointerY: number) {
    const currentX = this.pacman.x * TILE + TILE / 2
    const currentY = this.pacman.y * TILE + TILE / 2
    const dx = pointerX - currentX
    const dy = pointerY - currentY
    if (Math.abs(dx) >= Math.abs(dy)) {
      this.dir = { x: dx >= 0 ? 1 : -1, y: 0 }
      return
    }
    this.dir = { x: 0, y: dy >= 0 ? 1 : -1 }
  }

  update(deltaMs: number) {
    if (this.status !== 'running') return
    this.elapsed += deltaMs
    if (this.elapsed < this.speedMs) return
    this.elapsed = 0

    const next = { x: this.pacman.x + this.dir.x, y: this.pacman.y + this.dir.y }
    if (!this.isWall(next)) this.pacman = next
    const pelletKey = `${this.pacman.x},${this.pacman.y}`
    if (this.pellets.has(pelletKey)) {
      this.pellets.delete(pelletKey)
      this.score += 10
    }

    const gx = Math.sign(this.pacman.x - this.ghost.x)
    const gy = Math.sign(this.pacman.y - this.ghost.y)
    const horizontalTry = { x: this.ghost.x + gx, y: this.ghost.y }
    const verticalTry = { x: this.ghost.x, y: this.ghost.y + gy }
    const prioritizeHorizontal = Math.abs(this.pacman.x - this.ghost.x) >= Math.abs(this.pacman.y - this.ghost.y)
    const orderedMoves =
      this.difficulty === 'hard'
        ? prioritizeHorizontal
          ? [horizontalTry, verticalTry]
          : [verticalTry, horizontalTry]
        : Math.random() > 0.5
          ? [horizontalTry, verticalTry]
          : [verticalTry, horizontalTry]
    if (!this.isWall(orderedMoves[0])) this.ghost = orderedMoves[0]
    else if (!this.isWall(orderedMoves[1])) this.ghost = orderedMoves[1]

    if (this.ghost.x === this.pacman.x && this.ghost.y === this.pacman.y) {
      this.lives -= 1
      this.pacman = { x: 1, y: 1 }
      this.ghost = { x: 13, y: 7 }
      if (this.lives <= 0) this.status = 'lost'
    }

    if (this.pellets.size === 0) this.status = 'won'
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#020617'
    ctx.fillRect(0, 0, MAP[0].length * TILE, MAP.length * TILE)
    for (let y = 0; y < MAP.length; y += 1) {
      for (let x = 0; x < MAP[y].length; x += 1) {
        if (MAP[y][x] === '#') {
          ctx.fillStyle = '#2563eb'
          ctx.fillRect(x * TILE, y * TILE, TILE, TILE)
        }
        if (this.pellets.has(`${x},${y}`)) {
          ctx.fillStyle = '#f8fafc'
          ctx.fillRect(x * TILE + TILE / 2 - 2, y * TILE + TILE / 2 - 2, 4, 4)
        }
      }
    }
    ctx.fillStyle = '#facc15'
    ctx.beginPath()
    ctx.arc(this.pacman.x * TILE + TILE / 2, this.pacman.y * TILE + TILE / 2, TILE / 2 - 2, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#ff1f3d'
    ctx.fillRect(this.ghost.x * TILE + 2, this.ghost.y * TILE + 2, TILE - 4, TILE - 4)
  }

  handleInput(action: GameAction) {
    if (action === 'PAUSE') {
      this.pause(this.status !== 'paused')
      return
    }
    if (this.status !== 'running') return
    if (action === 'MOVE_LEFT') this.dir = { x: -1, y: 0 }
    if (action === 'MOVE_RIGHT') this.dir = { x: 1, y: 0 }
    if (action === 'MOVE_UP') this.dir = { x: 0, y: -1 }
    if (action === 'MOVE_DOWN') this.dir = { x: 0, y: 1 }
  }

  getSnapshot(): GameSnapshot {
    return {
      score: this.score,
      lives: this.lives,
      status: this.status,
      message:
        this.status === 'won'
          ? 'All pellets collected.'
          : this.status === 'lost'
            ? 'Ghosts got you.'
            : `${this.pellets.size} pellets left`,
    }
  }

  reset() {
    this.pacman = { x: 1, y: 1 }
    this.ghost = { x: 13, y: 7 }
    this.dir = { x: 1, y: 0 }
    this.status = 'running'
    this.score = 0
    this.lives = 3
    this.seedPellets()
  }

  pause(paused: boolean) {
    if (this.status === 'won' || this.status === 'lost') return
    this.status = paused ? 'paused' : 'running'
  }
}
