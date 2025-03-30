import React from 'react'

const GameScreen = () => {
  return (
    <div className="game-screen h-screen w-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="street-view-container w-screen h-full bg-gray-300 flex items-center justify-center">
        <span className="text-gray-700">Street View Imagery Goes Here</span>
      </div>
    </div>
  )
}

export default GameScreen