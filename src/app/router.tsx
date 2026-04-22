import { createBrowserRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { GamePage } from '../pages/GamePage'
import { MainMenuPage } from '../pages/MainMenuPage'

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <MainMenuPage /> },
      { path: 'game/:gameId', element: <GamePage /> },
    ],
  },
])
