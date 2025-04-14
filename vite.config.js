import { defineConfig, loadEnv } from 'vite'
import react from '@vitejs/plugin-react'
import { fileURLToPath } from 'url'
import path from 'path'
import tailwindcss from '@tailwindcss/vite'

// Get the directory path from import.meta.url
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default ({ mode }) => {
  // Use __dirname instead of process.cwd()
  const env = loadEnv(mode, __dirname);
  
  return defineConfig({
    plugins: [react(), tailwindcss()],
    base: '/localeap/',
    define: {
      // Make MAPILLARY_TOKEN available in the client code
      'import.meta.env.VITE_MAPILLARY_TOKEN': JSON.stringify(env.VITE_MAPILLARY_TOKEN)
    },
    optimizeDeps: {
      include: ['mapillary-js']
    },
    build: {
      rollupOptions: {
        external: ['mapillary-js/dist/mapillary.min.css']
      }
    }
  });
}