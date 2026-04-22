import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties, type PointerEvent } from 'react'
import { useNavigate } from 'react-router-dom'
import { GameHUD } from './GameHUD'
import { GameOverlayModal } from './GameOverlayModal'
import { TouchControls } from './TouchControls'
import { useKeyboardActions } from '../../games/core/input/useKeyboardActions'
import { useGameLoop } from '../../games/core/useGameLoop'
import type { GameAction, GameAdapter } from '../../games/core/types'

type CanvasGameProps = {
  factory: () => GameAdapter
  width: number
  height: number
  onCanvasPointerMove?: (
    adapter: GameAdapter,
    canvasX: number,
    canvasY: number,
    canvasWidth: number,
    canvasHeight: number,
  ) => void
  touchActions?: GameAction[]
  autoFocusCanvas?: boolean
  hideTouchControls?: boolean
  showExitButton?: boolean
}

export function CanvasGame({
  factory,
  width,
  height,
  onCanvasPointerMove,
  touchActions,
  autoFocusCanvas = false,
  hideTouchControls = false,
  showExitButton = false,
}: CanvasGameProps) {
  const navigate = useNavigate()
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const [, setTick] = useState(0)
  const adapter = useMemo(() => {
    const instance = factory()
    instance.init()
    return instance
  }, [factory])
  const snapshot = adapter.getSnapshot()

  const onAction = useCallback(
    (action: GameAction) => {
      adapter.handleInput(action)
      setTick((v) => v + 1)
    },
    [adapter],
  )

  useKeyboardActions(onAction)
  useEffect(() => {
    if (!autoFocusCanvas) return
    canvasRef.current?.focus()
  }, [autoFocusCanvas])

  useGameLoop({
    isRunning: snapshot.status === 'running',
    onUpdate: (delta) => {
      adapter.update(delta)
      setTick((v) => v + 1)
    },
    onRender: () => {
      const canvas = canvasRef.current
      if (!canvas) return
      const context = canvas.getContext('2d')
      if (!context) return
      adapter.render(context)
    },
  })

  const restart = () => {
    adapter.reset()
    setTick((v) => v + 1)
  }

  const pause = () => {
    adapter.pause(snapshot.status !== 'paused')
    setTick((v) => v + 1)
  }

  const isOverlay = snapshot.status === 'paused' || snapshot.status === 'won' || snapshot.status === 'lost'
  const handlePointerMove = useCallback(
    (event: PointerEvent<HTMLCanvasElement>) => {
      if (!onCanvasPointerMove) return
      const rect = event.currentTarget.getBoundingClientRect()
      const canvasX = ((event.clientX - rect.left) / rect.width) * width
      const canvasY = ((event.clientY - rect.top) / rect.height) * height
      onCanvasPointerMove(adapter, canvasX, canvasY, width, height)
      setTick((v) => v + 1)
    },
    [adapter, height, onCanvasPointerMove, width],
  )

  return (
    <div className="canvas-game" style={{ '--game-ratio': `${width} / ${height}` } as CSSProperties}>
      <GameHUD
        score={snapshot.score}
        lives={snapshot.lives}
        level={snapshot.level}
        onPause={pause}
        onRestart={restart}
        onExit={showExitButton ? () => navigate('/') : undefined}
      />
      {!hideTouchControls ? <TouchControls onAction={onAction} actions={touchActions} /> : null}
      <div className="canvas-stage">
        <canvas
          className="game-canvas"
          ref={canvasRef}
          width={width}
          height={height}
          tabIndex={0}
          onPointerMove={handlePointerMove}
          onPointerDown={(event) => {
            handlePointerMove(event)
            if (autoFocusCanvas) event.currentTarget.focus()
          }}
        />
      </div>
      <GameOverlayModal
        open={isOverlay}
        title={snapshot.status === 'paused' ? 'Paused' : snapshot.status === 'won' ? 'You Win' : 'Game Over'}
        description={snapshot.message ?? 'Choose your next action.'}
        onPrimary={restart}
        onSecondary={() => navigate('/')}
        primaryLabel="Play Again"
        secondaryLabel="Back to Menu"
      />
    </div>
  )
}
