import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.gltf', '**/*.bin', '**/*.glb'],

  base: '/KabeersPortfolio/',
})