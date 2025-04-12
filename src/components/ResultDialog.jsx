import React, { useEffect, useRef } from 'react'
import L from 'leaflet'
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png'
import markerIcon from 'leaflet/dist/images/marker-icon.png'
import markerShadow from 'leaflet/dist/images/marker-shadow.png'

// Fix Leaflet's default icon path issues
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: markerIcon,
  iconRetinaUrl: markerIcon2x,
  shadowUrl: markerShadow,
});

const ResultDialog = ({ distance, onPlayAgain, actualCoordinates, guessCoordinates }) => {
  const resultMapRef = useRef(null)

  useEffect(() => {
    // Initialize map once the component is mounted
    if (resultMapRef.current && actualCoordinates && guessCoordinates) {
      const map = L.map(resultMapRef.current).setView([
        (actualCoordinates.lat + guessCoordinates.lat) / 2,
        (actualCoordinates.lon + guessCoordinates.lng) / 2
      ], 3);

      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 19,
		attribution: '© OpenStreetMap',
		// remove zoom control
		zoomControl: false
      }).addTo(map);

      // Add marker for actual location
      const actualMarker = L.marker([actualCoordinates.lat, actualCoordinates.lon], {
        icon: L.divIcon({
          className: 'actual-location-marker',
          html: `<div class="w-6 h-6 rounded-full bg-red-500 border-2 border-white flex items-center justify-center text-white font-bold"> </div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(map);

      // Add marker for guess location
      const guessMarker = L.marker([guessCoordinates.lat, guessCoordinates.lng], {
        icon: L.divIcon({
          className: 'guess-location-marker',
          html: `<div class="w-6 h-6 rounded-full bg-blue-500 border-2 border-white flex items-center justify-center text-white font-bold">G</div>`,
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        })
      }).addTo(map);

      // Add a line connecting the two points
      const polyline = L.polyline([
        [actualCoordinates.lat, actualCoordinates.lon],
        [guessCoordinates.lat, guessCoordinates.lng]
      ], {
        color: 'red',
        weight: 2,
        opacity: 0.7,
        dashArray: '5, 10'
      }).addTo(map);

      // Fit the map to show both points with padding
      map.fitBounds(polyline.getBounds(), { padding: [50, 50] });

      // Clean up on unmount
      return () => {
        map.remove();
      };
    }
  }, [actualCoordinates, guessCoordinates]);

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
      <div className="bg-white p-6 rounded-lg shadow-xl max-w-xl w-full">
        <h2 className="text-2xl font-bold text-center mb-4">Result</h2>
        <div className="mb-6 h-64 relative rounded-lg overflow-hidden">
          <div ref={resultMapRef} className="w-full h-full"></div>
        </div>
    

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