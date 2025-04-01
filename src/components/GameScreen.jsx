import React, { useEffect, useState } from 'react'
import axios from 'axios'
import 'dotenv/config';

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN

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