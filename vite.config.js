import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/cat': {
        target: 'https://api.ai-cats.net',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/cat/, '/v1/cat'),
        secure: false,
      }
    }
  }
})
