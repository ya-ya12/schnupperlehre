import { Link, Outlet, useLocation } from 'react-router-dom'

export function AppShell() {
  const location = useLocation()
  const isGameRoute = location.pathname.startsWith('/game/')

  return (
    <div className={`app-shell ${isGameRoute ? 'game-shell' : ''}`}>
      {!isGameRoute ? (
        <header className="top-nav">
          <Link className="brand" to="/">
            Game Arcade
          </Link>
        </header>
      ) : null}
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}
