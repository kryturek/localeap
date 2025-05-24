import React, { useState, useRef, useCallback, useEffect } from 'react';
import axios from 'axios';
import { Viewer } from 'mapillary-js';
import '../assets/loader.css';

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN;

const GameScreen = ({ setCurrentCoordinates }) => {
  const imageDataRef = useRef(null); // To store the fetched image data
  const viewerRef = useRef(null); // To store the Viewer instance
  const [loading, setLoading] = useState(true); // To manage loading state

  // Function to fetch a random image from the Mapillary API
  const fetchRandomImage = useCallback(async () => {
    const getRandomCoordinates = () => {
      const lat = Math.random() * 120 - 60; // Latitude between -60 and 60
      const lon = Math.random() * 360 - 180; // Longitude between -180 and 180
      return { lat, lon };
    };

    let attemptsLimit = 100; // Maximum number of attempts
    let found = false; // Flag to indicate if an image was found
    const delta = 5; // Bounding box size

    while (!found && --attemptsLimit > 0) {
      const { lat, lon } = getRandomCoordinates();
      const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;

      try {
        const res = await axios.get(`https://graph.mapillary.com/images`, {
          params: {
            access_token: MAPILLARY_TOKEN,
            fields: 'id,thumb_2048_url,computed_geometry',
            limit: 1,
            bbox,
            is_pano: true,
          },
        });

        if (res.data.data && res.data.data.length > 0) {
          const imageData = res.data.data[0];
          return imageData; // Return the found image data
        }
      } catch (err) {
        console.log(`[FLOW] Error fetching image:`, err.message);
      }
    }

    throw new Error('No imagery found after maximum attempts');
  }, []);

  // Callback ref function to manage the DOM node and initialize the Viewer
  const nodeRef = useCallback(
    async (node) => {
      console.log('[DEBUG] nodeRef called with node:', node);
      if (node) {
        // If the node is mounted
        if (!imageDataRef.current) {
          try {
            imageDataRef.current = await fetchRandomImage(); // Fetch image data
          } catch (err) {
            console.error(err.message);
            setLoading(false);
            return;
          }
        }

        const imageData = imageDataRef.current;

        // Update the current coordinates
        setCurrentCoordinates({
          lat: imageData.computed_geometry.coordinates[1],
          lon: imageData.computed_geometry.coordinates[0],
        });

        console.log('[DEBUG] mly container dimensions:', node.offsetWidth, node.offsetHeight);

        // Initialize the Viewer
        viewerRef.current = new Viewer({
          accessToken: MAPILLARY_TOKEN,
          container: node, 
          imageKey: imageData.id,
          // imageKey: 277755748254846,
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
            keyboard: false,
          },
        });

        console.log('[DEBUG] Viewer initialized:', viewerRef.current);
        console.log('[DEBUG] Image Data:', imageData.id);

        setLoading(false); // Set loading to false once the Viewer is ready
      } else {
        // If the node is unmounted
        if (viewerRef.current) {
          viewerRef.current.remove(); // Clean up the Viewer instance
          viewerRef.current = null;
        }
      }
    },
    [setCurrentCoordinates, fetchRandomImage],
  );

  // Optional: Add any additional logic for the Viewer instance
  useEffect(() => {
    if (viewerRef.current) {
      console.log('[FLOW] Viewer is ready');
      // Add event listeners or manipulate the Viewer instance here
    }
  }, [viewerRef.current]);

  return (
    <>
      <style>
        {`
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
          #mly {
            width: 100%;
            height: 100%;
          }
        `}
      </style>
      <div className="game-screen h-screen w-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="street-view-container w-screen h-full bg-black flex items-center justify-center">
          <div
            id="mly"
            ref={nodeRef} // Attach the callback ref
            className="object-cover h-full w-full"
          >
            {loading && (
              <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50">
                <div className="loader"></div>
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default GameScreen;