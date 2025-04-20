import React, { useLayoutEffect, useRef, useState } from 'react'
import axios from 'axios'
import { Viewer } from 'mapillary-js'
import '../assets/loader.css'

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN

// Function to generate random coordinates globally
const getRandomCoordinates = () => {
  const lat = Math.random() * 120 - 60  // lat between -60 and 60
  const lon = Math.random() * 360 - 180 // lon between -180 and 180
  return { lat, lon }
}

const NewGameScreen = ({ setCurrentCoordinates }) => {
  const containerRef = useRef(null)
  const viewerRef = useRef(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // Poll until container has nonzero dimensions
  const waitForContainer = (callback) => {
    const container = containerRef.current
    if (container && container.offsetWidth > 0 && container.offsetHeight > 0) {
      callback()
    } else {
      requestAnimationFrame(() => waitForContainer(callback))
    }
  }

  // Fetch a random image key with a few attempts
  const fetchRandomImage = async () => {
    const maxAttempts = 20
    const delta = 5
    let attempt = 0, found = false, imageKey = null

    while (!found && attempt < maxAttempts) {
      attempt++
      const { lat, lon } = getRandomCoordinates()
      const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`
      try {
        const res = await axios.get('https://graph.mapillary.com/images', {
          params: {
            access_token: MAPILLARY_TOKEN,
            fields: 'id,thumb_2048_url,computed_geometry',
            limit: 1,
            bbox,
            is_pano: true
          }
        })
        if (res.data.data && res.data.data.length > 0) {
          const imageData = res.data.data[0]
          imageKey = imageData.id
          // Set the image coordinates in parent
          setCurrentCoordinates({
            lat: imageData.computed_geometry.coordinates[1],
            lon: imageData.computed_geometry.coordinates[0]
          })
          found = true
        }
      } catch (e) {
        console.error(`[NewGameScreen] Error fetching image on attempt ${attempt}:`, e)
      }
    }
    return imageKey
  }

  useLayoutEffect(() => {
    const initViewer = async () => {
      const imageKey = await fetchRandomImage()
      if (!imageKey) {
        setError('No imagery found after multiple attempts.')
        setLoading(false)
        return
      }
      // Wait until the container is fully laid out
      waitForContainer(() => {
        try {
          viewerRef.current = new Viewer({
            accessToken: MAPILLARY_TOKEN,
            container: containerRef.current,
            imageKey: imageKey,
            component: {
              cover: false,
              direction: false,
              sequence: false,
              zoom: false,
              attribution: false,
              bearing: false,
              spatial: false,
              tag: false,
              popup: false,
              image: true, // Enable image rendering
              navigation: false,
              cache: true,
              keyboard: false
            }
          })
          viewerRef.current.on('load', () => {
            console.log('[NewGameScreen] Viewer loaded.')
          })
          viewerRef.current.on('error', (err) => {
            console.error('[NewGameScreen] Viewer error:', err)
          })
          setLoading(false)
        } catch (err) {
          console.error('[NewGameScreen] Error creating viewer:', err)
          setError('Error initializing viewer.')
          setLoading(false)
        }
      })
    }

    initViewer()

    return () => {
      if (viewerRef.current) {
        viewerRef.current.remove()
        viewerRef.current = null
      }
    }
  }, [setCurrentCoordinates])

  return (
    <>
      {loading && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="loader"></div>
        </div>
      )}
      {error && (
        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70">
          <div className="bg-white p-4 rounded">
            <p className="text-red-500">{error}</p>
          </div>
        </div>
      )}
      <div
        id="mly"
        ref={containerRef}
        style={{ width: '100%', height: '100%', backgroundColor: '#000' }}
      ></div>
    </>
  )
}

export default NewGameScreen