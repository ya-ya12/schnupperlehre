import { Link, Outlet } from 'react-router-dom'

export function AppShell() {
  return (
    <div className="app-shell">
      <header className="top-nav">
        <Link className="brand" to="/">
          Arcade Hub
        </Link>
      </header>
      <main className="page-content">
        <Outlet />
      </main>
    </div>
  )
}
