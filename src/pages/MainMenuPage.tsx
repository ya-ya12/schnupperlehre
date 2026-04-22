import { Link, useNavigate } from 'react-router-dom'
import { useAppStore } from '../app/store/useAppStore'
import { gameRegistry } from '../games/registry'

const copy = {
  en: {
    title: 'Game Arcade',
    subtitle: 'Wähle ein spiel aus und starte sofort',
    difficulty: 'Difficulty',
    soundEnabled: 'Sound Enabled',
    play: 'Play',
    chooseLanguage: 'Choose language',
    chooseLanguageDescription: 'Select your preferred language before entering the arcade.',
    english: 'English',
    german: 'German',
  },
  de: {
    title: 'Game Arcade',
    subtitle: 'Wähle ein spiel aus und starte sofort',
    difficulty: 'Schwierigkeit',
    soundEnabled: 'Sound aktivieren',
    play: 'Spielen',
    chooseLanguage: 'Sprache waehlen',
    chooseLanguageDescription: 'Bitte waehle deine Sprache, bevor du startest.',
    english: 'Englisch',
    german: 'Deutsch',
  },
} as const

export function MainMenuPage() {
  const navigate = useNavigate()
  const difficulty = useAppStore((state) => state.difficulty)
  const setDifficulty = useAppStore((state) => state.setDifficulty)
  const soundEnabled = useAppStore((state) => state.soundEnabled)
  const setSoundEnabled = useAppStore((state) => state.setSoundEnabled)
  const language = useAppStore((state) => state.language)
  const setLanguage = useAppStore((state) => state.setLanguage)
  const activeCopy = copy[language ?? 'en']

  return (
    <div className="menu-page">
      <section className="menu-header">
        <h1>{activeCopy.title}</h1>
        <p>{activeCopy.subtitle}</p>
      </section>

      <section className="settings">
        <label>
          {activeCopy.difficulty}
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
          {activeCopy.soundEnabled}
        </label>
      </section>

      <section className="game-grid">
        {gameRegistry.map((game) => (
          <article
            key={game.id}
            className="game-card"
            role="button"
            tabIndex={0}
            onClick={() => navigate(`/game/${game.id}`)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault()
                navigate(`/game/${game.id}`)
              }
            }}
          >
            <h2>{game.name}</h2>
            <p>{game.description}</p>
            <Link
              to={`/game/${game.id}`}
              onClick={(event) => {
                event.stopPropagation()
              }}
            >
              {activeCopy.play}
            </Link>
          </article>
        ))}
      </section>

      {!language ? (
        <div className="overlay" role="dialog" aria-modal="true">
          <div className="overlay-content">
            <h2>{activeCopy.chooseLanguage}</h2>
            <p>{activeCopy.chooseLanguageDescription}</p>
            <div className="overlay-actions">
              <button type="button" onClick={() => setLanguage('en')}>
                {activeCopy.english}
              </button>
              <button type="button" onClick={() => setLanguage('de')}>
                {activeCopy.german}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  )
}
