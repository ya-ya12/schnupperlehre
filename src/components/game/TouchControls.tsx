import type { GameAction } from '../../games/core/types'

type TouchControlsProps = {
  onAction: (action: GameAction) => void
  actions?: GameAction[]
}

const labels: Record<GameAction, string> = {
  MOVE_LEFT: 'Left',
  MOVE_RIGHT: 'Right',
  MOVE_UP: 'Up',
  MOVE_DOWN: 'Down',
  ROTATE: 'Rotate',
  DROP: 'Drop',
  SELECT: 'Select',
  PAUSE: 'Pause',
}

const defaultActions: GameAction[] = ['MOVE_LEFT', 'MOVE_RIGHT', 'MOVE_UP', 'MOVE_DOWN', 'ROTATE', 'DROP']

export function TouchControls({ onAction, actions = defaultActions }: TouchControlsProps) {
  return (
    <div className="touch-controls" aria-label="Touch controls">
      {actions.map((action) => (
        <button key={action} type="button" onClick={() => onAction(action)}>
          {labels[action]}
        </button>
      ))}
    </div>
  )
}
