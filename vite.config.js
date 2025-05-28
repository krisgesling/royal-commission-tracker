import { defineConfig } from 'vite'
import { svelte } from '@sveltejs/vite-plugin-svelte'

// https://vite.dev/config/
export default defineConfig({
  base: '/royal-commission-tracker/', // Set to your repo name for GitHub Pages
  plugins: [svelte()],
})
