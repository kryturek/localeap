import { use, useEffect, useState } from 'react'
import './App.css'
import ExpandableMap from './components/ExpandableMap'
import GameScreen from './components/GameScreen'
import StartScreen from './components/StartScreen'

function App() {
  const [gameStarted, setGameStarted] = useState(false)
  const [currentCoordinates, setCurrentCoordinates] = useState(null)
  const [guessMarker, setGuessMarker] = useState({ lat: 0, lon: 0 })

  const startGame = () => {
    setGameStarted(true)
  }

  useEffect(() => {
    if (currentCoordinates) {
      console.log('Current Image Coordinates:', currentCoordinates)
    }
  }, [currentCoordinates])

  useEffect(() => {
    if (guessMarker) {
      console.log('Guess Marker Coordinates:', guessMarker)
    }
  }
  , [guessMarker])

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
