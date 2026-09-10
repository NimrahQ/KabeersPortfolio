import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.gltf', '**/*.bin', '**/*.glb'],
  // Matches the GitHub Pages project URL (https://nimrahq.github.io/KabeersPortfolio/)
  // so the built JS/CSS <script>/<link> tags resolve correctly there
  // instead of pointing at the domain root.
  base: '/KabeersPortfolio/',
})
