import { useState } from 'react'
import './App.css'
import ExpandableMap from './components/ExpandableMap'
import GameScreen from './components/GameScreen'
import StartScreen from './components/StartScreen'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentCoordinates, setCurrentCoordinates] = useState({ lat: 0, lon: 0 })
  const [guessMarker, setGuessMarker] = useState({ lat: 0, lon: 0 })

  const startGame = () => {
    setGameStarted(true)
  }

  return (
    <>
    {gameStarted ? (
      <>
      <GameScreen setCurrentCoordinates={setCurrentCoordinates} />
      <ExpandableMap setGuessMarker={setGuessMarker} />
      </>
    ) : (
      <StartScreen onStart={startGame} />
    )}
    </>
  )
}

export default App
