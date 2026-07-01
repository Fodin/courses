import path from 'path'

import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

import { courseScaffoldPlugin } from '../../packages/course-platform/vite-plugins'

export default defineConfig({
  plugins: [react(), courseScaffoldPlugin({ courseDir: __dirname })],
  resolve: {
    alias: {
      src: path.resolve(__dirname, './src'),
      exercises: path.resolve(__dirname, './exercises'),
    },
  },
  server: {
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
  },
})
