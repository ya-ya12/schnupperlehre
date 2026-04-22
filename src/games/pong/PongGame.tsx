import { useMemo } from 'react'
import { useAppStore } from '../../app/store/useAppStore'
import { CanvasGame } from '../../components/game/CanvasGame'
import { PongAdapter } from './pongAdapter'

export function PongGame() {
  const difficulty = useAppStore((state) => state.difficulty)
  const factory = useMemo(() => () => new PongAdapter(difficulty), [difficulty])
  return <CanvasGame factory={factory} width={640} height={400} />
}
