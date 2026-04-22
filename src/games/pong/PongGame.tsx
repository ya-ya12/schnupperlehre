import { useCallback, useMemo } from 'react'
import { useAppStore } from '../../app/store/useAppStore'
import { CanvasGame } from '../../components/game/CanvasGame'
import type { GameAdapter } from '../core/types'
import { PongAdapter } from './pongAdapter'

export function PongGame() {
  const difficulty = useAppStore((state) => state.difficulty)
  const factory = useMemo(() => () => new PongAdapter(difficulty), [difficulty])
  const handleCanvasPointerMove = useCallback((adapter: GameAdapter, _canvasX: number, canvasY: number) => {
    if (adapter instanceof PongAdapter) adapter.setPlayerYFromPointer(canvasY)
  }, [])

  return <CanvasGame factory={factory} width={640} height={400} onCanvasPointerMove={handleCanvasPointerMove} />
}
