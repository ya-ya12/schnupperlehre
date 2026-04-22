import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAppStore } from '../../app/store/useAppStore'
import { GameHUD } from '../../components/game/GameHUD'
import { GameOverlayModal } from '../../components/game/GameOverlayModal'
import { checkWinner, createBoard, dropToken, isBoardFull, type Board } from './connect4'

function pickCpuMove(board: Board): number {
  const options = board[0].map((value, idx) => (value === 0 ? idx : -1)).filter((idx) => idx >= 0)
  return options[Math.floor(Math.random() * options.length)] ?? 0
}

export function Connect4Game() {
  const navigate = useNavigate()
  const difficulty = useAppStore((state) => state.difficulty)
  const [board, setBoard] = useState(createBoard)
  const [status, setStatus] = useState<'running' | 'won' | 'lost' | 'paused'>('running')
  const [message, setMessage] = useState('Your turn')
  const [score, setScore] = useState(0)

  const canPlay = status === 'running'
  const level = useMemo(() => (difficulty === 'easy' ? 1 : difficulty === 'hard' ? 3 : 2), [difficulty])

  const reset = () => {
    setBoard(createBoard())
    setStatus('running')
    setMessage('Your turn')
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
    const cpuCol = pickCpuMove(next)
    dropToken(next, cpuCol, 2)
    if (checkWinner(next, 2)) {
      setBoard(next)
      setStatus('lost')
      setMessage('CPU wins this round.')
      return
    }
    setBoard(next)
  }

  return (
    <div>
      <GameHUD score={score} level={level} onPause={() => setStatus('paused')} onRestart={reset} />
      <div className="connect4-board" role="grid" aria-label="Connect four board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <button
              key={`${rowIndex}-${colIndex}`}
              type="button"
              className={`cell player-${cell}`}
              onClick={() => playMove(colIndex)}
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
