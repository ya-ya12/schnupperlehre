import type { GameAction } from '../../games/core/types'

type TouchControlsProps = {
  onAction: (action: GameAction) => void
}

export function TouchControls({ onAction }: TouchControlsProps) {
  return (
    <div className="touch-controls" aria-label="Touch controls">
      <button type="button" onClick={() => onAction('MOVE_LEFT')}>
        Left
      </button>
      <button type="button" onClick={() => onAction('MOVE_RIGHT')}>
        Right
      </button>
      <button type="button" onClick={() => onAction('MOVE_UP')}>
        Up
      </button>
      <button type="button" onClick={() => onAction('MOVE_DOWN')}>
        Down
      </button>
      <button type="button" onClick={() => onAction('ROTATE')}>
        Rotate
      </button>
      <button type="button" onClick={() => onAction('DROP')}>
        Drop
      </button>
    </div>
  )
}
