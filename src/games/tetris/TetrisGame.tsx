import { useMemo } from 'react'
import { useAppStore } from '../../app/store/useAppStore'
import { CanvasGame } from '../../components/game/CanvasGame'
import { TetrisAdapter } from './tetrisAdapter'

export function TetrisGame() {
  const difficulty = useAppStore((state) => state.difficulty)
  const factory = useMemo(() => () => new TetrisAdapter(difficulty), [difficulty])
  return (
    <CanvasGame
      factory={factory}
      width={384}
      height={480}
      touchActions={['MOVE_LEFT', 'MOVE_RIGHT', 'MOVE_UP']}
      autoFocusCanvas
      showExitButton
    />
  )
}
