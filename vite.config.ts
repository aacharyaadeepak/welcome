import { copyFile, mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [
    react(),
    {
      name: 'github-pages-static-routes',
      async writeBundle() {
        for (const route of ['gallery', 'pujas']) {
          const routeDirectory = resolve('dist', route)
          await mkdir(routeDirectory, { recursive: true })
          await copyFile(resolve('dist/index.html'), resolve(routeDirectory, 'index.html'))
        }
      },
    },
  ],
  base: '/welcome',
})
