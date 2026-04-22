import { Link } from 'react-router-dom'
import { useAppStore } from '../app/store/useAppStore'
import { gameRegistry } from '../games/registry'

export function MainMenuPage() {
  const difficulty = useAppStore((state) => state.difficulty)
  const setDifficulty = useAppStore((state) => state.setDifficulty)
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const setSoundEnabled = useAppStore((state) => state.setSoundEnabled)

  return (
    <div className="menu-page">
      <section className="menu-header">
        <h1>Arcade Hub</h1>
        <p>Choose a game and play instantly.</p>
      </section>

      <section className="settings">
        <label>
          Difficulty
          <select
            value={difficulty}
            onChange={(event) => setDifficulty(event.target.value as 'easy' | 'normal' | 'hard')}
          >
            <option value="easy">Easy</option>
            <option value="normal">Normal</option>
            <option value="hard">Hard</option>
          </select>
        </label>
        <label className="checkbox">
          <input
            checked={soundEnabled}
            onChange={(event) => setSoundEnabled(event.target.checked)}
            type="checkbox"
          />
          Sound Enabled
        </label>
      </section>

      <section className="game-grid">
        {gameRegistry.map((game) => (
          <article key={game.id} className="game-card">
            <h2>{game.name}</h2>
            <p>{game.description}</p>
            <Link to={`/game/${game.id}`}>Play</Link>
          </article>
        ))}
      </section>
    </div>
  )
}
