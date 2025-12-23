// ============================================================================
// VITE CONFIGURATION
// ============================================================================
// Vite is the build tool and dev server for our React app.
// Key concepts here:
// 1. Dev server runs on port 3000
// 2. Proxy: Forwards /api requests to the backend
// 3. Docker networking: Services communicate using service names, not localhost
// ============================================================================

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    host: true,  // Listen on all network interfaces (needed for Docker)
    proxy: {
      // Any request to /api/* gets forwarded to the backend
      '/api': {
        // IMPORTANT: In Docker, use service name 'backend' not 'localhost'
        // 'localhost' inside a container refers to that container itself!
        // 'backend' refers to the backend service defined in docker-compose.yml
        target: 'http://backend:3001',
        changeOrigin: true,  // Changes the origin header to match the target
      },
    },
  },
})
