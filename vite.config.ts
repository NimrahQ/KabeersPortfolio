import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  assetsInclude: ['**/*.gltf', '**/*.bin', '**/*.glb'],
  // Relative base so the built JS/CSS <script>/<link> tags resolve
  // correctly no matter what subpath the site is served from — this is
  // what was 404ing on GitHub Pages, where a project site is served at
  // https://<user>.github.io/<repo>/ rather than the domain root, so the
  // default absolute "/assets/..." paths pointed at the wrong place.
  base: './',
})
