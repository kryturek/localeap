import React from 'react';
import { Viewer } from 'mapillary-js';
import axios from 'axios';
import '../assets/loader.css';

const MAPILLARY_TOKEN = import.meta.env.VITE_MAPILLARY_TOKEN;


class GameScreen extends React.Component {
  constructor(props) {
    super(props);
    this.containerRef = React.createRef(); // Reference to the container div
    this.state = {
      imageId: null, // Initially, no imageId
      loading: true,
      error: null,
    };
  }

  componentDidMount() {
    console.log("[GameScreen] Component mounted. Fetching random image ID...");
    this.fetchRandomImageId()
      .then((imageId) => {
        if (imageId) {
          console.log("[GameScreen] Initializing viewer with image ID:", imageId);

          console.log("[GameScreen] Container dimensions:", this.containerRef.current?.offsetWidth, this.containerRef.current?.offsetHeight);

          if (!this.containerRef.current?.offsetWidth || !this.containerRef.current?.offsetHeight) {
            console.error("[GameScreen] Container has invalid dimensions. Viewer cannot be initialized.");
            return;
          }

          setTimeout(() => {
            console.log("[GameScreen] Delayed initialization of viewer");
            this.viewer = new Viewer({
              accessToken: MAPILLARY_TOKEN,
              container: this.containerRef.current,
              imageKey: imageId,
              component: {
                cover: false,
                direction: false,
                sequence: false,
                zoom: false,
                attribution: true,
                bearing: false,
                spatial: false,
                tag: false,
                popup: false,
                image: true,
                navigation: false,
                cache: true
              }
            });

            // Add more aggressive error handling
            this.viewer.on('error', (err) => {
              console.error("[GameScreen] Viewer error:", err);
            });

            // Monitor all viewer events to see what's happening
            this.viewer.on('load', () => {
              console.log("[GameScreen] Viewer loaded");
              this.viewer.refresh();
            });

            this.viewer.on('dataloading', () => {
              console.log("[GameScreen] Data loading");
            });

            this.viewer.on('dataload', () => {
              console.log("[GameScreen] Data loaded");
            });

            // Explicitly request image loading
            try {
              console.log("[GameScreen] Explicitly requesting image load");
              this.viewer.moveToKey(imageId).catch(err => {
                console.error("[GameScreen] Error moving to key:", err);
              });
            } catch (err) {
              console.error("[GameScreen] Error during explicit image load:", err);
            }

            // Force resize after initialization
            this.viewer.resize();
            console.log("[GameScreen] Viewer resized");
          }, 100);
          setTimeout(() => {
            const mapillaryElements = document.querySelectorAll('.mapillary-js-dom');
            console.log("[GameScreen] Mapillary DOM elements:", mapillaryElements.length);
          }, 500);
          this.setState({ loading: false });
        } else {
          console.warn("[GameScreen] No image ID found after multiple attempts.");
          this.setState({ error: "No images found after multiple attempts.", loading: false });
        }
      })
      .catch((error) => {
        console.error("[GameScreen] Error fetching random image ID:", error);
        this.setState({ error: "Failed to fetch image ID.", loading: false });
      });
  }

  componentWillUnmount() {
    console.log("[GameScreen] Component unmounted. Cleaning up viewer...");
    if (this.viewer) {
      this.viewer.remove();
    }
  }

  async fetchRandomImageId(maxAttempts = 50) {
    let attempt = 0;

    while (attempt < maxAttempts) {
      attempt++;
      const { lat, lon } = this.getRandomCoordinates();
      const delta = 5; // Bounding box size
      const bbox = `${lon - delta},${lat - delta},${lon + delta},${lat + delta}`;
      const url = `https://graph.mapillary.com/images?access_token=${MAPILLARY_TOKEN}&bbox=${bbox}&limit=1&is_pano=true&fields=id,computed_geometry`;

      console.log(`[GameScreen] Attempt ${attempt}: Fetching image from bbox ${bbox}`);

      try {
        const response = await axios.get(url);
        console.log("[GameScreen] API response:", response.data);
        const data = response.data;

        if (data && data.data && data.data.length > 0) {
          const image = data.data[0];
          console.log("[GameScreen] Found image:", image.id, "Coordinates:", image.computed_geometry.coordinates);
          this.props.setCurrentCoordinates({
            lat: image.computed_geometry.coordinates[1],
            lon: image.computed_geometry.coordinates[0],
          });
          return image.id; // Return the image ID if found
        } else {
          console.warn(`[GameScreen] Attempt ${attempt}: No images found in bbox ${bbox}`);
        }
      } catch (error) {
        console.error(`[GameScreen] Attempt ${attempt}: Error fetching data from Mapillary API:`, error);
      }
    }

    console.error("[GameScreen] Max attempts reached. No images found.");
    return null; // Return null if no image is found after max attempts
  }

  getRandomCoordinates() {
    const lat = Math.random() * 120 - 60; // Latitude between -60 and 60
    const lon = Math.random() * 360 - 180; // Longitude between -180 and 180
    return { lat, lon };
  }

  render() {
    const { loading, error } = this.state;

    const cssLoaded = Array.from(document.styleSheets).some(sheet => {
      try {
        return sheet.href && sheet.href.includes('mapillary');
      } catch (e) {
        return false;
      }
    });
    console.log("[GameScreen] Mapillary CSS loaded:", cssLoaded);

    return (
      <div className="game-screen h-screen w-screen flex items-center justify-center bg-gray-100 overflow-hidden">
        {loading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 z-10">
            <div className="loader"></div>
            <p className="text-white mt-4">Loading...</p>
          </div>
        )}
        {error && (
          <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-70 z-20">
            <div className="bg-white p-6 rounded-lg max-w-md text-center">
              <p className="text-red-500 mb-4">{error}</p>
              <button
                onClick={() => window.location.reload()}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              >
                Try Again
              </button>
            </div>
          </div>
        )}
        <div
          ref={this.containerRef}
          className="w-full h-full"
          style={{ backgroundColor: '#000' }}
          id='mapillary-viewer'
        />
      </div>
    );
  }
}

export default GameScreen;