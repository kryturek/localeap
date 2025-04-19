import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Viewer } from 'mapillary-js';
import '../assets/loader.css'

console.log("[FLOW] 1. Module loading");
const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN;
console.log("[FLOW] 2. MAPILLARY_TOKEN:", !!MAPILLARY_TOKEN);

const GameScreen = ({setCurrentCoordinates}) => {
  console.log("[FLOW] 3. Component function executing");
  const viewerRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Function to generate random coordinates within a given range.
  const getRandomCoordinates = () => {
    const lat = Math.random() * 120 - 60; // lat between -60 and 60
    const lon = Math.random() * 360 - 180; // lon between -180 and 180
    return { lat, lon };
  };

  useEffect(() => {
    console.log("[FLOW] 4. Main useEffect running");
    
    const fetchRandomImageAndInitViewer = async () => {
      console.log("[FLOW] 5. fetchRandomImageAndInitViewer started");
      setLoading(true);
      const maxAttempts = 100;
      let attempt = 0;
      let found = false;
      let imageKey = null;
      const delta = 5; // size of bbox (adjust as needed)

      console.log("[FLOW] 6. Starting search loop");
      while (!found && attempt < maxAttempts) {
        attempt++;
        const { lat, lon } = getRandomCoordinates();
        const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
        console.log(`[FLOW] 7. Attempt ${attempt}: Fetching with bbox ${bbox}`);

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
          console.log(`[FLOW] 8. Got API response for attempt ${attempt}`);

          if (res.data.data && res.data.data.length > 0) {
            const imageData = res.data.data[0];
            imageKey = imageData.id;
            found = true;
            console.log("[FLOW] 9. Found image:", imageKey, imageData.computed_geometry.coordinates);
            setCurrentCoordinates({
              lat: imageData.computed_geometry.coordinates[1],
              lon: imageData.computed_geometry.coordinates[0],
            });
          } else {
            console.log(`[FLOW] 9a. No images found for bbox ${bbox}`);
          }
        } catch (err) {
          console.log(`[FLOW] 9b. Error fetching image:`, err.message);
        }
      }

      console.log("[FLOW] 10. Search loop ended, found:", found);
      if (!found) {
        console.log('[FLOW] 11a. No imagery found after maximum attempts.');
      } else {
        console.log('[FLOW] 11b. Initializing viewer with key:', imageKey);
        
        if (!viewerRef.current) {
          console.log("[FLOW] 12. Creating new viewer instance");
          try {
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
            console.log("[FLOW] 13. Viewer instance created:", !!viewerRef.current);
            
            // Add event listeners to track if they fire
            viewerRef.current.on('load', () => {
              console.log("[FLOW] 14a. VIEWER LOAD EVENT FIRED!");
            });
            
            viewerRef.current.on('error', (err) => {
              console.log("[FLOW] 14b. VIEWER ERROR EVENT:", err);
            });
            
          } catch (err) {
            console.log("[FLOW] 13a. ERROR creating viewer:", err.message);
          }
        } else {
          console.log("[FLOW] 12a. Moving existing viewer to:", imageKey);
          try {
            viewerRef.current.moveTo(imageKey);
            console.log("[FLOW] 13b. Moved viewer successfully");
          } catch (err) {
            console.log("[FLOW] 13c. ERROR moving viewer:", err.message);
          }
        }
      }

      console.log("[FLOW] 15. Setting loading to false");
      setLoading(false);
    };

    fetchRandomImageAndInitViewer();

    return () => {
      console.log("[FLOW] 16. Cleanup function running");
      if(viewerRef.current) {
        try {
          console.log("[FLOW] 17. Removing viewer");
          viewerRef.current.remove();
          viewerRef.current = null;
          console.log("[FLOW] 18. Viewer removed successfully");
        } catch (err) {
          console.log("[FLOW] 18a. ERROR removing viewer:", err.message);
        }
      }
    }
  }, [setCurrentCoordinates]);

  useEffect(() => {
    console.log("[FLOW] 19. CSS check effect running");
    // Check if CSS is loaded
    setTimeout(() => {
      const cssLoaded = Array.from(document.styleSheets).some(sheet => {
        try {
          return sheet.href && sheet.href.includes('mapillary');
        } catch (e) {
          return false;
        }
      });
      console.log("[FLOW] 20. Mapillary CSS loaded:", cssLoaded);
      
      // Check if mly container exists
      const container = document.getElementById('mly');
      console.log("[FLOW] 21. mly container exists:", !!container);
      
      // Check if any mapillary DOM elements exist
      const mapillaryElements = document.querySelectorAll('.mapillary-js-dom');
      console.log("[FLOW] 22. mapillary-js-dom elements:", mapillaryElements.length);
    }, 1000);
  }, []);

  console.log("[FLOW] 23. Rendering component");
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
        `}
      </style>
      <div className="game-screen h-screen w-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        <div className="street-view-container w-screen h-full bg-black flex items-center justify-center">
            <div
              id='mly'
              className="object-cover h-full w-full"
              onLoad={() => console.log("[FLOW] 24. mly div onLoad event")}
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

console.log("[FLOW] 0. Module evaluated");
export default GameScreen;