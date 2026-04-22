import type { GameAction, GameAdapter, GameSnapshot } from '../core/types'

const WIDTH = 640
const HEIGHT = 400
const PADDLE_HEIGHT = 80
const PADDLE_WIDTH = 12
const BALL_SIZE = 10
const WIN_SCORE = 11

type PongState = {
  playerY: number
  cpuY: number
  ballX: number
  ballY: number
  ballVx: number
  ballVy: number
  playerScore: number
  cpuScore: number
  status: GameSnapshot['status']
}

export class PongAdapter implements GameAdapter {
  private state: PongState
  private difficulty: 'easy' | 'normal' | 'hard'

  constructor(difficulty: 'easy' | 'normal' | 'hard') {
    this.difficulty = difficulty
    this.state = this.createState()
  }

  private createState(): PongState {
    const speedFactor = this.difficulty === 'easy' ? 0.9 : this.difficulty === 'hard' ? 1.35 : 1
    return {
      playerY: HEIGHT / 2 - PADDLE_HEIGHT / 2,
      cpuY: HEIGHT / 2 - PADDLE_HEIGHT / 2,
      ballX: WIDTH / 2,
      ballY: HEIGHT / 2,
      ballVx: 0.23 * speedFactor,
      ballVy: 0.19 * speedFactor,
      playerScore: 0,
      cpuScore: 0,
      status: 'idle',
    }
  }

  init() {
    this.state.status = 'running'
  }

  update(deltaMs: number) {
    if (this.state.status !== 'running') return
    this.state.ballX += this.state.ballVx * deltaMs
    this.state.ballY += this.state.ballVy * deltaMs

    if (this.state.ballY <= 0 || this.state.ballY + BALL_SIZE >= HEIGHT) this.state.ballVy *= -1

    const cpuSpeed = this.difficulty === 'easy' ? 0.16 : this.difficulty === 'hard' ? 0.3 : 0.22
    const center = this.state.cpuY + PADDLE_HEIGHT / 2
    if (center < this.state.ballY) this.state.cpuY += cpuSpeed * deltaMs
    if (center > this.state.ballY) this.state.cpuY -= cpuSpeed * deltaMs
    this.state.cpuY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, this.state.cpuY))

    this.handlePaddleCollisions()
    this.handleScore()
  }

  private handlePaddleCollisions() {
    if (this.state.ballX <= PADDLE_WIDTH) {
      if (this.state.ballY + BALL_SIZE >= this.state.playerY && this.state.ballY <= this.state.playerY + PADDLE_HEIGHT) {
        this.state.ballVx = Math.abs(this.state.ballVx)
      }
    }
    if (this.state.ballX + BALL_SIZE >= WIDTH - PADDLE_WIDTH) {
      if (this.state.ballY + BALL_SIZE >= this.state.cpuY && this.state.ballY <= this.state.cpuY + PADDLE_HEIGHT) {
        this.state.ballVx = -Math.abs(this.state.ballVx)
      }
    }
  }

  private handleScore() {
    if (this.state.ballX < 0) {
      this.state.cpuScore += 1
      this.resetBall(-1)
    }
    if (this.state.ballX > WIDTH) {
      this.state.playerScore += 1
      this.resetBall(1)
    }
    if (this.state.playerScore >= WIN_SCORE) this.state.status = 'won'
    if (this.state.cpuScore >= WIN_SCORE) this.state.status = 'lost'
  }

  private resetBall(dir: number) {
    const speedFactor = this.difficulty === 'easy' ? 0.9 : this.difficulty === 'hard' ? 1.35 : 1
    this.state.ballX = WIDTH / 2
    this.state.ballY = HEIGHT / 2
    this.state.ballVx = (0.18 + Math.random() * 0.08) * speedFactor * dir
    this.state.ballVy = (Math.random() - 0.5) * 0.35 * speedFactor
  }

  render(ctx: CanvasRenderingContext2D) {
    ctx.fillStyle = '#0f172a'
    ctx.fillRect(0, 0, WIDTH, HEIGHT)
    ctx.fillStyle = '#fff'
    ctx.fillRect(0, this.state.playerY, PADDLE_WIDTH, PADDLE_HEIGHT)
    ctx.fillRect(WIDTH - PADDLE_WIDTH, this.state.cpuY, PADDLE_WIDTH, PADDLE_HEIGHT)
    ctx.fillRect(this.state.ballX, this.state.ballY, BALL_SIZE, BALL_SIZE)
  }

  handleInput(action: GameAction) {
    if (action === 'PAUSE') {
      this.pause(this.state.status !== 'paused')
      return
    }
    if (this.state.status !== 'running') return
    if (action === 'MOVE_UP') this.state.playerY -= 20
    if (action === 'MOVE_DOWN') this.state.playerY += 20
    this.state.playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, this.state.playerY))
  }

  setPlayerYFromPointer(pointerY: number) {
    if (this.state.status !== 'running') return
    this.state.playerY = pointerY - PADDLE_HEIGHT / 2
    this.state.playerY = Math.max(0, Math.min(HEIGHT - PADDLE_HEIGHT, this.state.playerY))
  }

  getSnapshot(): GameSnapshot {
    return {
      score: this.state.playerScore,
      level: WIN_SCORE,
      status: this.state.status,
      message: `${this.state.playerScore} : ${this.state.cpuScore}`,
    }
  }

  reset() {
    this.state = this.createState()
    this.init()
  }

  pause(paused: boolean) {
    if (this.state.status === 'won' || this.state.status === 'lost') return
    this.state.status = paused ? 'paused' : 'running'
  }
}
