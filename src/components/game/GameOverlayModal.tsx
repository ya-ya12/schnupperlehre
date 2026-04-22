type GameOverlayModalProps = {
  open: boolean
  title: string
  description: string
  onPrimary: () => void
  onSecondary: () => void
  primaryLabel: string
  secondaryLabel: string
}

export function GameOverlayModal(props: GameOverlayModalProps) {
  const {
    open,
    title,
    description,
    onPrimary,
    onSecondary,
    primaryLabel,
    secondaryLabel,
  } = props

  if (!open) return null

  return (
    <div className="overlay" role="dialog" aria-modal="true">
      <div className="overlay-content">
        <h2>{title}</h2>
        <p>{description}</p>
        <div className="overlay-actions">
          <button type="button" onClick={onPrimary}>
            {primaryLabel}
          </button>
          <button type="button" onClick={onSecondary}>
            {secondaryLabel}
          </button>
        </div>
      </div>
    </div>
  )
}
