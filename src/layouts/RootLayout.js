import React from 'react'
import { Outlet } from 'react-router-dom'

import AppToolBar from '../components/appToolBar.component'

export default function RootLayout() {
  return (
    <div>
      <header>
        <AppToolBar />
      </header>
      <main>
        <Outlet />
      </main>
    </div>
  )
}
