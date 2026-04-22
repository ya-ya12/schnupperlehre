import type { GameAction, GameAdapter, GameSnapshot } from '../core/types'

const COLS = 16
const ROWS = 20
const CELL = 24

type Grid = number[][]
type Piece = { shape: number[][]; x: number; y: number; color: number }

const PIECES = [
  [[1, 1, 1, 1]],
  [
    [1, 1],
    [1, 1],
  ],
  [
    [0, 1, 0],
    [1, 1, 1],
  ],
  [
    [1, 0, 0],
    [1, 1, 1],
  ],
  [
    [0, 0, 1],
    [1, 1, 1],
  ],
  [
    [0, 1, 1],
    [1, 1, 0],
  ],
  [
    [1, 1, 0],
    [0, 1, 1],
  ],
]

const TETRIS_COLORS: Record<number, string> = {
  1: '#38bdf8',
  2: '#f97316',
  3: '#34d399',
  4: '#f472b6',
  5: '#a78bfa',
  6: '#fde047',
}

export class TetrisAdapter implements GameAdapter {
  private board: Grid = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
  private piece: Piece = this.newPiece()
  private score = 0
  private lines = 0
  private status: GameSnapshot['status'] = 'idle'
  private dropElapsed = 0
  private speed: number

  constructor(difficulty: 'easy' | 'normal' | 'hard') {
    this.speed = difficulty === 'easy' ? 760 : difficulty === 'hard' ? 230 : 500
  }

  private newPiece(): Piece {
    const shape = PIECES[Math.floor(Math.random() * PIECES.length)]
    return { shape, x: Math.floor(COLS / 2) - 1, y: 0, color: Math.floor(Math.random() * 6) + 1 }
  }

  init() {
    this.status = 'running'
  }

  update(deltaMs: number) {
    if (this.status !== 'running') return
    this.dropElapsed += deltaMs
    if (this.dropElapsed >= this.speed) {
      this.dropElapsed = 0
      this.move(0, 1)
    }
  }

  private collides(piece: Piece): boolean {
    for (let y = 0; y < piece.shape.length; y += 1) {
      for (let x = 0; x < piece.shape[y].length; x += 1) {
        if (!piece.shape[y][x]) continue
        const nx = piece.x + x
        const ny = piece.y + y
        if (nx < 0 || nx >= COLS || ny >= ROWS) return true
        if (ny >= 0 && this.board[ny][nx]) return true
      }
    }
    return false
  }

  private lockPiece() {
    for (let y = 0; y < this.piece.shape.length; y += 1) {
      for (let x = 0; x < this.piece.shape[y].length; x += 1) {
        if (!this.piece.shape[y][x]) continue
        const ny = this.piece.y + y
        const nx = this.piece.x + x
        if (ny < 0) {
          this.status = 'lost'
          return
        }
        this.board[ny][nx] = this.piece.color
      }
    }
    this.clearLines()
    this.piece = this.newPiece()
    if (this.collides(this.piece)) this.status = 'lost'
  }

  private clearLines() {
    let cleared = 0
    this.board = this.board.filter((row) => {
      const full = row.every((cell) => cell !== 0)
      if (full) cleared += 1
      return !full
    })
    while (this.board.length < ROWS) this.board.unshift(Array(COLS).fill(0))
    this.lines += cleared
    this.score += cleared * cleared * 100
  }

  private move(dx: number, dy: number) {
    const next = { ...this.piece, x: this.piece.x + dx, y: this.piece.y + dy }
    if (!this.collides(next)) {
      this.piece = next
      return
    }
    if (dy > 0) this.lockPiece()
  }

  private rotate() {
    const rotated = this.piece.shape[0].map((_, i) => this.piece.shape.map((r) => r[i]).reverse())
    const next = { ...this.piece, shape: rotated }
    if (!this.collides(next)) this.piece = next
  }

  private getLandingY(): number {
    let landingY = this.piece.y
    let probe = { ...this.piece, y: landingY }
    while (!this.collides({ ...probe, y: probe.y + 1 })) {
      probe = { ...probe, y: probe.y + 1 }
      landingY = probe.y
    }
    return landingY
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#0b1020'
    ctx.fillRect(0, 0, COLS * CELL, ROWS * CELL)
    ctx.strokeStyle = '#334155'
    ctx.lineWidth = 1
    for (let x = 0; x <= COLS; x += 1) {
      ctx.beginPath()
      ctx.moveTo(x * CELL + 0.5, 0)
      ctx.lineTo(x * CELL + 0.5, ROWS * CELL)
      ctx.stroke()
    }
    for (let y = 0; y <= ROWS; y += 1) {
      ctx.beginPath()
      ctx.moveTo(0, y * CELL + 0.5)
      ctx.lineTo(COLS * CELL, y * CELL + 0.5)
      ctx.stroke()
    }
    ctx.strokeStyle = '#f9a8d4'
    ctx.lineWidth = 4
    ctx.strokeRect(2, 2, COLS * CELL - 4, ROWS * CELL - 4)
    for (let y = 0; y < ROWS; y += 1) {
      for (let x = 0; x < COLS; x += 1) {
        if (!this.board[y][x]) continue
        ctx.fillStyle = TETRIS_COLORS[this.board[y][x]] ?? '#60a5fa'
        ctx.fillRect(x * CELL + 1, y * CELL + 1, CELL - 2, CELL - 2)
        ctx.strokeStyle = '#f8fafc'
        ctx.strokeRect(x * CELL + 1.5, y * CELL + 1.5, CELL - 3, CELL - 3)
      }
    }
    for (let y = 0; y < this.piece.shape.length; y += 1) {
      for (let x = 0; x < this.piece.shape[y].length; x += 1) {
        if (!this.piece.shape[y][x]) continue
        ctx.fillStyle = TETRIS_COLORS[this.piece.color] ?? '#f59e0b'
        ctx.fillRect((this.piece.x + x) * CELL + 1, (this.piece.y + y) * CELL + 1, CELL - 2, CELL - 2)
        ctx.strokeStyle = '#ffffff'
        ctx.strokeRect((this.piece.x + x) * CELL + 1.5, (this.piece.y + y) * CELL + 1.5, CELL - 3, CELL - 3)
      }
    }
    const landingY = this.getLandingY()
    if (landingY > this.piece.y) {
      ctx.strokeStyle = '#ffffff'
      ctx.lineWidth = 2
      for (let y = 0; y < this.piece.shape.length; y += 1) {
        for (let x = 0; x < this.piece.shape[y].length; x += 1) {
          if (!this.piece.shape[y][x]) continue
          ctx.strokeRect((this.piece.x + x) * CELL + 4, (landingY + y) * CELL + 4, CELL - 8, CELL - 8)
        }
      }
    }
  }

  handleInput(action: GameAction) {
    if (action === 'PAUSE') {
      this.pause(this.status !== 'paused')
      return
    }
    if (this.status !== 'running') return
    if (action === 'MOVE_LEFT') this.move(-1, 0)
    if (action === 'MOVE_RIGHT') this.move(1, 0)
    if (action === 'MOVE_DOWN') this.move(0, 1)
    if (action === 'ROTATE' || action === 'MOVE_UP') this.rotate()
    if (action === 'DROP') while (this.status === 'running') this.move(0, 1)
  }

  getSnapshot(): GameSnapshot {
    return {
      score: this.score,
      level: Math.floor(this.lines / 10) + 1,
      status: this.status,
      message: this.status === 'lost' ? 'Blocks reached the top.' : undefined,
    }
  }

  reset() {
    this.board = Array.from({ length: ROWS }, () => Array(COLS).fill(0))
    this.piece = this.newPiece()
    this.score = 0
    this.lines = 0
    this.status = 'running'
  }

  pause(paused: boolean) {
    if (this.status === 'lost' || this.status === 'won') return
    this.status = paused ? 'paused' : 'running'
  }
}
