import React from 'react'

const ResultDialog = ({ distance, onPlayAgain }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-md w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Result</h2>
        <p className="text-xl text-center mb-6">
          Your guess was <span className="font-bold">{Math.round(distance)} km</span> away!
        </p>
        <div className="flex justify-center">
          <button 
            onClick={onPlayAgain}
            className="bg-green-500 text-white px-6 py-2 rounded-lg font-medium hover:bg-green-600 transition-colors"
          >
            Play Again
          </button>
        </div>
      </div>
    </div>
  )
}

export default ResultDialog