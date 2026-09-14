import { env } from 'node:process'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages serves the app from /<repo>/; the workflow sets VITE_BASE_PATH.
  base: env.VITE_BASE_PATH || '/',
  plugins: [react()],
})
