type GameHUDProps = {
  score: number
  lives?: number
  level?: number
  onPause: () => void
  onRestart: () => void
}

export function GameHUD({ score, lives, level, onPause, onRestart }: GameHUDProps) {
  return (
    <section className="hud" aria-label="Game status and controls">
      <div className="hud-stats">
        <span>Score: {score}</span>
        {typeof lives === 'number' ? <span>Lives: {lives}</span> : null}
        {typeof level === 'number' ? <span>Level: {level}</span> : null}
      </div>
      <div className="hud-actions">
        <button onClick={onPause} type="button">
          Pause
        </button>
        <button onClick={onRestart} type="button">
          Restart
        </button>
      </div>
    </section>
  )
}
