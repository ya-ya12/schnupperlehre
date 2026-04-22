import { useEffect } from 'react'
import type { GameAction } from '../types'

const keyMap: Record<string, GameAction> = {
  ArrowLeft: 'MOVE_LEFT',
  ArrowRight: 'MOVE_RIGHT',
  ArrowUp: 'MOVE_UP',
  ArrowDown: 'MOVE_DOWN',
  KeyA: 'MOVE_LEFT',
  KeyD: 'MOVE_RIGHT',
  KeyW: 'MOVE_UP',
  KeyS: 'MOVE_DOWN',
  Space: 'DROP',
  KeyR: 'ROTATE',
  Enter: 'SELECT',
  KeyP: 'PAUSE',
  Escape: 'PAUSE',
}

export function useKeyboardActions(onAction: (action: GameAction) => void) {
  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      const action = keyMap[event.code]
      if (!action) return
      event.preventDefault()
      onAction(action)
    }

    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [onAction])
}
