import { createHashRouter } from 'react-router-dom'
import { AppShell } from '../components/layout/AppShell'
import { GamePage } from '../pages/GamePage'
import { MainMenuPage } from '../pages/MainMenuPage'

export const router = createHashRouter([
  {
    path: '/',
    element: <AppShell />,
    children: [
      { index: true, element: <MainMenuPage /> },
      { path: 'game/:gameId', element: <GamePage /> },
    ],
  },
])
