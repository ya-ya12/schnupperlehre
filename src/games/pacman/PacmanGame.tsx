import { useCallback, useMemo } from 'react'
import { useAppStore } from '../../app/store/useAppStore'
import { CanvasGame } from '../../components/game/CanvasGame'
import type { GameAdapter } from '../core/types'
import { PacmanAdapter } from './pacmanAdapter'

export function PacmanGame() {
  const difficulty = useAppStore((state) => state.difficulty)
  const factory = useMemo(() => () => new PacmanAdapter(difficulty), [difficulty])
  const handleCanvasPointerMove = useCallback((adapter: GameAdapter, canvasX: number, canvasY: number) => {
    if (adapter instanceof PacmanAdapter) adapter.setDirectionFromPointer(canvasX, canvasY)
  }, [])

  return (
    <CanvasGame
      factory={factory}
      width={360}
      height={216}
      onCanvasPointerMove={handleCanvasPointerMove}
      autoFocusCanvas
      hideTouchControls
    />
  )
}
