import React, { useEffect, useRef, useState } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import '../leaflet-custom.css'

const ExpandableMap = ({setGuessMarker}) => {
  const mapRef = useRef(null)
  const [isHovered, setIsHovered] = useState(false)
  const guessMarker = useRef(null)
  const mapInstance = useRef(null)
  const [hasMarker, setHasMarker] = useState(false)


  useEffect(() => {
	mapInstance.current = L.map(mapRef.current, {
		center: [20, 0],
		zoom: 2,
		attribution: '© OpenStreetMap',
		zoomControl: false
	})

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19, }).addTo(mapInstance.current);

	mapInstance.current.on('click', (e) => {
		if(guessMarker.current) {
			mapInstance.current.removeLayer(guessMarker.current)
		}
		guessMarker.current = L.marker(e.latlng).addTo(mapInstance.current)
		setHasMarker(true)
	})

	return () => {
		mapInstance.current.remove();
		console.log('Map component unmounted');
	}

	}, [])

	useEffect(() => {
		if (mapInstance.current) {
			setTimeout(() => {
				mapInstance.current.invalidateSize();
			}, 330)
		}
	}, [isHovered])
	

  return (
	<div 
	  className='map-container absolute bottom-4 right-4 w-36 h-36 hover:w-156 hover:h-124 transition-all duration-300 opacity-70 hover:opacity-100 z-10'
	  onMouseEnter={() => setIsHovered(true)}
	  onMouseLeave={() => setIsHovered(false)}
	>
		<div ref={mapRef} className="w-full h-full rounded-lg shadow-lg"></div>
		{isHovered && hasMarker && (
			<button 
			className="absolute bottom-4 left-4 mt-2 px-4 py-2 bg-green-500 text-white rounded shadow-md shadow-emerald-500 hover:bg-green-600 z-1000 cursor-pointer font-mono font-bold border-3 border-white"
			onClick={() => {
				if (guessMarker.current) {
					setGuessMarker(guessMarker.current.getLatLng())
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