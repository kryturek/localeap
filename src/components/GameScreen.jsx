import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN;

const GameScreen = () => {
  const [imageUrl, setImageUrl] = useState(null);
  const [loading, setLoading] = useState(true);

  // Function to generate random coordinates within a given range.
  const getRandomCoordinates = () => {
    // Define the region: lat between 35 and 60, lon between -10 and 40
    const lat = Math.random() * (60 - 35) + 35;
    const lon = Math.random() * (40 - (-10)) + (-10);
    return { lat, lon };
  };

  useEffect(() => {
    const fetchRandomImage = async () => {
      setLoading(true);
      const maxAttempts = 10;
      let attempt = 0;
      let found = false;
      let fetchedImageUrl = null;
      const delta = 0.02; // size of bbox (adjust as needed)

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
                fields: 'id,thumb_2048_url',
                limit: 1,
                bbox,
              },
            }
          );

          if (res.data.data && res.data.data.length > 0) {
            const imageData = res.data.data[0];
            fetchedImageUrl = imageData.thumb_2048_url
              ? imageData.thumb_2048_url
              : `https://images.mapillary.com/${imageData.id}/thumb-2048.jpg`;
            found = true;
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
        setImageUrl(fetchedImageUrl);
      }

      setLoading(false);
    };

    fetchRandomImage();
  }, []);

  return (
    <div className="game-screen h-screen w-screen flex items-center justify-center bg-gray-100 overflow-hidden">
      <div className="street-view-container w-screen h-full bg-black flex items-center justify-center">
        {loading ? (
          <span className="text-white">Loading...</span>
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt="Mapillary Street View"
            className="object-cover h-full w-full"
          />
        ) : (
          <span className="text-white">No imagery available.</span>
        )}
      </div>
    </div>
  );
};

export default GameScreen;