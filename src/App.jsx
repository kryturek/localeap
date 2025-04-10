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

  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371 // Radius of the Earth in km
    const dLat = (lat2 - lat1) * Math.PI / 180
    const dLon = (lon2 - lon1) * Math.PI / 180
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a))
    return R * c
  }

  useEffect(() => {
    // if user has guessed
    if (guessMarker && currentCoordinates) {
      console.log('Current Image Coordinates:', currentCoordinates)
      console.log('Guess Marker Coordinates:', guessMarker)

      console.log('Distance:', calculateDistance(
        currentCoordinates.lat,
        currentCoordinates.lon,
        guessMarker.lat,
        guessMarker.lng
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
