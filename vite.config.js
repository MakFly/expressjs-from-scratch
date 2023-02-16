import { defineConfig } from 'vite'
import mix from 'vite-plugin-mix'

export default defineConfig({
  plugins: [
    mix({
      handler: './kernel/dev/server-vite.js',
    }),
  ],
  build: {
    rollupOptions: {
    }
  }
})