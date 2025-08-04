import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: '/Fichenature/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  }
})
