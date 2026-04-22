import { Link, useNavigate, useParams } from 'react-router-dom'
import { gameById } from '../games/registry'

export function GamePage() {
  const { gameId } = useParams()
  const navigate = useNavigate()
  const selected = gameById.get((gameId ?? '') as never)

  if (!selected) {
    return (
      <section>
        <p>Game not found.</p>
        <Link to="/">Back to menu</Link>
      </section>
    )
  }

  const GameComponent = selected.component
  return (
    <section className={`game-page ${selected.themeClass}`}>
      <button type="button" className="back-btn" onClick={() => navigate('/')}>
        Back to menu
      </button>
      <h1>{selected.name}</h1>
      <GameComponent />
    </section>
  )
}
