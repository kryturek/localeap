import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Viewer } from 'mapillary-js';
import '../assets/loader.css'

const MAPILLARY_TOKEN = "MLY|9650546664967142|03ac0f95e6da6c9ce6847b9c5aed0b96";

const GameScreen = ({setCurrentCoordinates}) => {
  const viewerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const initializeViewer = (imageKey) => {
    console.log("initializeViewer(): initializing viewer with key:", imageKey)

    // clean up previous viewer instance
    if (viewerRef.current) {
      console.log("initializeViewer(): removing previous viewer instance");
      viewerRef.current.remove();
      viewerRef.current = null;
    }

    // wait for DOM to be ready
    setTimeout(() => {
      try {
        console.log("initializeViewer(): creating new viewer instance");
        viewerRef.current = new Viewer({
          accessToken: MAPILLARY_TOKEN,
          container: 'mly',
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
            image: true,
            navigation: false,
            cache: true,
            keyboard: false
          }
        });

        // onload event
        viewerRef.current.on('load', () => {
          console.log("Viewer loaded successfully");
          setLoading(false);
        })

        // error event
        viewerRef.current.on('error', (err) => {
          console.error("Viewer error:", err);
          setLoading(false);
          setError("Failed to load street view.");
        })
      } catch (err) {
        console.log("Error creating viewer:", err);
        setError("Failed to initialize viewer.");
        setLoading(false);
      }
    }, 1000);
  };

  // Function to generate random coordinates within a given range.
  const getRandomCoordinates = () => {
    const lat = Math.random() * 120 - 60; // lat between -60 and 60
    const lon = Math.random() * 360 - 180; // lon between -180 and 180
    return { lat, lon };
  };

  useEffect(() => {
    const fetchRandomImageAndInitViewer = async () => {
      setLoading(true);
      setError(null);
      console.log("Fetching random image data...");
      const maxAttempts = 100;
      let attempt = 0;
      let found = false;
      let imageKey = null;
      const delta = 3; // size of bbox (adjust as needed)

      while (!found && attempt < maxAttempts) {
        attempt++;
        const { lat, lon } = getRandomCoordinates();
        const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;

        try {
          const res = await axios.get(
            `https://graph.mapillary.com/images`,
            {
              params: {
                access_token: MAPILLARY_TOKEN,
                fields: 'id,thumb_2048_url,computed_geometry',
                limit: 1,
                bbox,
                is_pano: true
              },
            }
          );

          if (res.data.data && res.data.data.length > 0) {
            const imageData = res.data.data[0];
            imageKey = imageData.id;
            found = true;
            console.log(imageData.computed_geometry.coordinates);
            setCurrentCoordinates({
              lat: imageData.computed_geometry.coordinates[1],
              lon: imageData.computed_geometry.coordinates[0],
            });
          } else {
            console.error(`Attempt ${attempt}: No images found for bbox ${bbox}`);
          }
        } catch (err) {
          console.error(`Attempt ${attempt}: Error fetching image:`, err);
        }
      }

      if (!found) {
        console.error('No imagery found after maximum attempts.');
        setError('Could not find a suitable image. Please try again.');
        setLoading(false);
      } else {
        initializeViewer(imageKey);
      }
    };

    fetchRandomImageAndInitViewer();

    return () => {
      if(viewerRef.current) {
        viewerRef.current.remove();
        viewerRef.current = null;
      }
    }
  }, [setCurrentCoordinates]);

  useEffect(() => {
    console.log("Mapillary token available:", !!MAPILLARY_TOKEN);
    if (!MAPILLARY_TOKEN) {
      console.error("WARNING: No Mapillary token found!");
    }
  }, []);

  return (
    <>
      <style>
        {`
          #mly {
            position: relative;
            width: 100%;
            height: 100%;
            background-color: #000;
          }
          .mapillary-js-dom {
            position: absolute;
            width: 100%;
            height: 100%;
            overflow: hidden;
          }
          .mapillary-js-canvas {
            position: absolute;
            width: 100%;
            height: 100%;
            background-color: #000;
          }
        `}
      </style>
      <div className="game-screen h-screen w-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="street-view-container w-screen h-full bg-black flex items-center justify-center">
          <div
            id="mly"
            className="w-full h-full"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="loader"></div>
              </div>
            )}
            
            {error && (
              <div className="absolute inset-0 flex flex-col items-center justify-center bg-black bg-opacity-70 z-10">
                <p className="text-red-400 mb-4">{error}</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                >
                  Try Again
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameScreen;