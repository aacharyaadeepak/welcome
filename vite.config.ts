import { copyFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'github-pages-gallery-route',
      async closeBundle() {
        const galleryDirectory = resolve('dist/gallery')
        await mkdir(galleryDirectory, { recursive: true })
        await copyFile(resolve('dist/index.html'), resolve(galleryDirectory, 'index.html'))
      },
    },
  ],
  base: '/welcome',
})
