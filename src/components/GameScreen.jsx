import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { Viewer } from 'mapillary-js';
import '../assets/loader.css'

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN || "MLY|9650546664967142|03ac0f95e6da6c9ce6847b9c5aed0b96";

const GameScreen = ({setCurrentCoordinates}) => {
  const viewerRef = useRef(null);
  const [loading, setLoading] = useState(true);

  // Function to generate random coordinates within a given range.
  const getRandomCoordinates = () => {
    const lat = Math.random() * 120 - 60; // lat between -60 and 60
    const lon = Math.random() * 360 - 180; // lon between -180 and 180
    return { lat, lon };
  };

  useEffect(() => {
    const fetchRandomImageAndInitViewer = async () => {
      setLoading(true);
      const maxAttempts = 100;
      let attempt = 0;
      let found = false;
      let imageKey = null;
      const delta = 5;

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
      } else {
        if( !viewerRef.current ) {
          setTimeout(() => {
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
            })
          }, 1000);
        } else {
          viewerRef.current.moveTo(imageKey);
        }
      }

      setLoading(false);
    };

    fetchRandomImageAndInitViewer();

    return () => {
      if(viewerRef.current) {
        viewerRef.current.remove();
        viewerRef.current = null;
      }
    }
  }, [setCurrentCoordinates]);

  return (
    <div className="game-screen h-screen w-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="street-view-container w-screen h-full bg-black flex items-center justify-center">
          <div
            id='mly'
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
  );
};

export default GameScreen;