import { useMemo } from 'react'
import { useAppStore } from '../../app/store/useAppStore'
import { CanvasGame } from '../../components/game/CanvasGame'
import { PacmanAdapter } from './pacmanAdapter'

export function PacmanGame() {
  const difficulty = useAppStore((state) => state.difficulty)
  const factory = useMemo(() => () => new PacmanAdapter(difficulty), [difficulty])
  return <CanvasGame factory={factory} width={300} height={180} />
}
