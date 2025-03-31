import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'

const ExpandableMap = () => {
  const mapRef = useRef(null)

  useEffect(() => {
	const map = L.map(mapRef.current, {
		center: [20, 0],
		zoom: 2,
		attributionControl: false,
		zoomControl: false,
	})

	L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
		maxZoom: 19, }).addTo(map);

	let guessMarker;

	map.on('click', (e) => {
		if(guessMarker) {
			map.removeLayer(guessMarker)
		}
		guessMarker = L.marker(e.latlng).addTo(map)
	})

	return () => {
		map.remove();
	}

	})

  return (
	<div className='map-container absolute bottom-4 right-4 w-36 h-36 hover:w-156 hover:h-124 transition-all duration-300 opacity-70 hover:opacity-100'>
		<div ref={mapRef} className="w-full h-full rounded-lg shadow-lg"></div>
	</div>
  )
}

export default ExpandableMap