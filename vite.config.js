import { defineConfig } from 'vite'
import mix from 'vite-plugin-mix'

export default defineConfig({
  plugins: [
    mix({
      handler: './server-vite.js',
    }),
  ],
  build: {
    rollupOptions: {
    }
  }
})