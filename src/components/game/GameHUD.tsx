type GameHUDProps = {
  score: number
  lives?: number
  level?: number
  onPause: () => void
  onRestart: () => void
  onExit?: () => void
}

export function GameHUD({ score, lives, level, onPause, onRestart, onExit }: GameHUDProps) {
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
        {onExit ? (
          <button className="exit-btn" onClick={onExit} type="button">
            Exit
          </button>
        ) : null}
      </div>
    </section>
  )
}
