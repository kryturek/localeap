import { useEffect, useState } from 'react'
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
    // if user has guessed
    if (guessMarker && currentCoordinates) {
      console.log('Current Image Coordinates:', currentCoordinates)
      console.log('Guess Marker Coordinates:', guessMarker)

      console.log('Distance:', Math.sqrt(
        Math.pow(currentCoordinates.lat - guessMarker.lat, 2) +
        Math.pow(currentCoordinates.lon - guessMarker.lng, 2)
      ).toFixed(2))
    }
  }
  , [currentCoordinates, guessMarker])

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
