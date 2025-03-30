import React from 'react'

const StartScreen = ({onStart}) => {
  return (
	<div className="start-screen h-screen w-screen flex flex-col items-center justify-center bg-gray-200">
		<h1 className='text-6xl mb-12'>LocaLeap</h1>
		<button
			onClick={onStart}
			className="text-4xl px-25 py-8 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition cursor-pointer">Start</button>
	</div>
  )
}

export default StartScreen