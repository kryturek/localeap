import { useState } from 'react'
import './App.css'
import ExpandableMap from './components/ExpandableMap'
import GameScreen from './components/GameScreen'
import StartScreen from './components/StartScreen'

function App() {
  const [gameStarted, setGameStarted] = useState(false)

  const startGame = () => {
    setGameStarted(true)
  }

  return (
    <>
    {gameStarted ? (
      <>
      <GameScreen />
      <ExpandableMap />
      </>
    ) : (
      <StartScreen onStart={startGame} />
    )}
    </>
  )
}

export default App
