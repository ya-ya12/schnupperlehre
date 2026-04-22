import { useMemo } from 'react'
import { useAppStore } from '../../app/store/useAppStore'
import { CanvasGame } from '../../components/game/CanvasGame'
import { TetrisAdapter } from './tetrisAdapter'

export function TetrisGame() {
  const difficulty = useAppStore((state) => state.difficulty)
  const factory = useMemo(() => () => new TetrisAdapter(difficulty), [difficulty])
  return <CanvasGame factory={factory} width={200} height={400} />
}
