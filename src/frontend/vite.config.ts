import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      // Proxy API calls to the BFF
      '/api': {
        target: process.env.BFF_HTTPS || process.env.BFF_HTTP,
        changeOrigin: true
      }
    }
  }
})
