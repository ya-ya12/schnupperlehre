import { useEffect, useMemo, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../app/store/useAppStore'
import { GameHUD } from '../../components/game/GameHUD'
import { GameOverlayModal } from '../../components/game/GameOverlayModal'
import { checkWinner, createBoard, dropToken, isBoardFull, type Board } from './connect4'

function getValidColumns(board: Board): number[] {
  return board[0].map((value, idx) => (value === 0 ? idx : -1)).filter((idx) => idx >= 0)
}

function simulateDrop(board: Board, col: number, player: 1 | 2): Board | null {
  const next = board.map((row) => [...row])
  const row = dropToken(next, col, player)
  return row === -1 ? null : next
}

function scoreWindow(window: number[]): number {
  const cpuCount = window.filter((cell) => cell === 2).length
  const playerCount = window.filter((cell) => cell === 1).length
  const emptyCount = window.filter((cell) => cell === 0).length
  if (cpuCount === 4) return 100
  if (cpuCount === 3 && emptyCount === 1) return 10
  if (cpuCount === 2 && emptyCount === 2) return 3
  if (playerCount === 3 && emptyCount === 1) return -12
  return 0
}

function scoreBoard(board: Board): number {
  const rows = board.length
  const cols = board[0].length
  let score = 0
  const centerCol = Math.floor(cols / 2)
  for (let row = 0; row < rows; row += 1) {
    if (board[row][centerCol] === 2) score += 4
  }
  for (let row = 0; row < rows; row += 1) {
    for (let col = 0; col <= cols - 4; col += 1) {
      score += scoreWindow([board[row][col], board[row][col + 1], board[row][col + 2], board[row][col + 3]])
    }
  }
  for (let row = 0; row <= rows - 4; row += 1) {
    for (let col = 0; col < cols; col += 1) {
      score += scoreWindow([board[row][col], board[row + 1][col], board[row + 2][col], board[row + 3][col]])
    }
  }
  return score
}

function pickCpuMove(board: Board, difficulty: 'easy' | 'normal' | 'hard'): number {
  const options = getValidColumns(board)
  if (!options.length) return 0

  // Human-like: still takes direct win when obvious.
  for (const col of options) {
    const winBoard = simulateDrop(board, col, 2)
    if (winBoard && checkWinner(winBoard, 2)) return col
  }

  const blockChance = difficulty === 'easy' ? 0.35 : difficulty === 'hard' ? 1 : 0.55
  if (Math.random() < blockChance) {
    for (const col of options) {
      const blockBoard = simulateDrop(board, col, 1)
      if (blockBoard && checkWinner(blockBoard, 1)) return col
    }
  }

  const centerPreference = difficulty === 'easy' ? 0.25 : difficulty === 'hard' ? 0.85 : 0.45
  if (Math.random() < centerPreference) {
    const center = 3
    const sorted = [...options].sort((a, b) => Math.abs(a - center) - Math.abs(b - center))
    return sorted[0] ?? options[0]
  }

  if (difficulty === 'hard') {
    let bestCol = options[0]
    let bestScore = Number.NEGATIVE_INFINITY
    for (const col of options) {
      const next = simulateDrop(board, col, 2)
      if (!next) continue
      // Avoid moves that give player an instant response-win.
      const playerCanWin = getValidColumns(next).some((playerCol) => {
        const playerNext = simulateDrop(next, playerCol, 1)
        return playerNext ? checkWinner(playerNext, 1) : false
      })
      const score = scoreBoard(next) + (playerCanWin ? -50 : 0)
      if (score > bestScore) {
        bestScore = score
        bestCol = col
      }
    }
    return bestCol
  }

  return options[Math.floor(Math.random() * options.length)] ?? 0
}

export function Connect4Game() {
  const navigate = useNavigate()
  const difficulty = useAppStore((state) => state.difficulty)
  const [board, setBoard] = useState(createBoard)
  const [status, setStatus] = useState<'running' | 'won' | 'lost' | 'paused'>('running')
  const [message, setMessage] = useState('Your turn')
  const [score, setScore] = useState(0)
  const [cpuThinking, setCpuThinking] = useState(false)
  const cpuTimeoutRef = useRef<number | null>(null)

  const canPlay = status === 'running' && !cpuThinking
  const level = useMemo(() => (difficulty === 'easy' ? 1 : difficulty === 'hard' ? 3 : 2), [difficulty])
  const cpuDelayMs = useMemo(() => (difficulty === 'easy' ? 1300 : difficulty === 'hard' ? 900 : 1100), [difficulty])

  useEffect(() => {
    return () => {
      if (cpuTimeoutRef.current) window.clearTimeout(cpuTimeoutRef.current)
    }
  }, [])

  const reset = () => {
    if (cpuTimeoutRef.current) window.clearTimeout(cpuTimeoutRef.current)
    cpuTimeoutRef.current = null
    setBoard(createBoard())
    setStatus('running')
    setCpuThinking(false)
    setMessage('Your turn')
  }

  const pauseGame = () => {
    if (cpuTimeoutRef.current) window.clearTimeout(cpuTimeoutRef.current)
    cpuTimeoutRef.current = null
    setCpuThinking(false)
    setStatus('paused')
    setMessage('Game paused.')
  }

  const playMove = (col: number) => {
    if (!canPlay) return
    const next = board.map((row) => [...row])
    const row = dropToken(next, col, 1)
    if (row === -1) return
    if (checkWinner(next, 1)) {
      setBoard(next)
      setStatus('won')
      setScore((s) => s + 1)
      setMessage('You connected four.')
      return
    }
    if (isBoardFull(next)) {
      setBoard(next)
      setStatus('paused')
      setMessage('Draw game.')
      return
    }
    setBoard(next)
    setCpuThinking(true)
    setMessage('Robot is thinking...')
    cpuTimeoutRef.current = window.setTimeout(() => {
      cpuTimeoutRef.current = null
      const cpuBoard = next.map((nextRow) => [...nextRow])
      const cpuCol = pickCpuMove(cpuBoard, difficulty)
      dropToken(cpuBoard, cpuCol, 2)
      if (checkWinner(cpuBoard, 2)) {
        setBoard(cpuBoard)
        setStatus('lost')
        setCpuThinking(false)
        setMessage('CPU wins this round.')
        return
      }
      if (isBoardFull(cpuBoard)) {
        setBoard(cpuBoard)
        setStatus('paused')
        setCpuThinking(false)
        setMessage('Draw game.')
        return
      }
      setBoard(cpuBoard)
      setCpuThinking(false)
      setMessage('Your turn')
    }, cpuDelayMs)
  }

  return (
    <div className="connect4-game">
      <GameHUD score={score} level={level} onPause={pauseGame} onRestart={reset} />
      <div className="connect4-board" role="grid" aria-label="Connect four board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              className={`cell player-${cell}`}
              onClick={() => playMove(colIndex)}
              disabled={!canPlay}
              aria-label={`Column ${colIndex + 1}, row ${rowIndex + 1}`}
            />
          )),
        )}
      </div>
      <GameOverlayModal
        open={status !== 'running'}
        title={status === 'won' ? 'You Win' : status === 'lost' ? 'Game Over' : 'Paused'}
        description={message}
        onPrimary={reset}
        onSecondary={() => navigate('/')}
        primaryLabel="Play Again"
        secondaryLabel="Back to Menu"
      />
    </div>
  )
}
