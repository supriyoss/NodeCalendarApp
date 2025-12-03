import React from 'react'
import Calendar from './components/Calendar'

export default function App() {
  return (
    <div className="app-container">
      <header>
        <h1>Calendar — {new Date().getFullYear()}</h1>
      </header>
      <main>
        <Calendar />
      </main>
      <footer>
        <small>Events are stored in browser localStorage.</small>
      </footer>
    </div>
  )
}
