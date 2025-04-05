import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const ExpandableMap = () => {
  const mapRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  let guessMarker = useRef(null)

  useEffect(() => {
	const map = L.map(mapRef.current, {
		center: [20, 0],
		zoom: 2,
		attributionControl: false,
		zoomControl: false,
	})

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19, }).addTo(map);

	map.on('click', (e) => {
		if(guessMarker.current) {
			map.removeLayer(guessMarker.current)
		}
		guessMarker.current = L.marker(e.latlng).addTo(map)
	})

	return () => {
		map.remove();
		console.log('Map component unmounted');
	}

	}, [])

  return (
	<div 
	  className='map-container absolute bottom-4 right-4 w-36 h-36 hover:w-156 hover:h-124 transition-all duration-300 opacity-70 hover:opacity-100 z-10'
	  onMouseEnter={() => setIsHovered(true)}
	  onMouseLeave={() => setIsHovered(false)}
	>
		<div ref={mapRef} className="w-full h-full rounded-lg shadow-lg"></div>
		{isHovered && (
			<button 
			className="absolute bottom-4 left-4 mt-2 px-4 py-2 bg-green-500 text-white rounded shadow-md hover:bg-green-600 z-1000"
			onClick={() => {
				if (guessMarker.current) {
					console.log('Submitting coordinates:', guessMarker.current.getLatLng());
					// logic to submit the guess
				} else {
					alert('Please select a location on the map first');
				}
			}}
			>
				Submit Guess
			</button>
		)}
	</div>
  )
}

export default ExpandableMap