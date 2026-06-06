import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['image_planet/logo.png', 'apple-touch-icon.png'],
      manifest: {
        name: 'Stellar Diary - Nhật ký Vũ trụ',
        short_name: 'Stellar Diary',
        description: 'Nhật ký cá nhân theo phong cách vũ trụ',
        theme_color: '#121414',
        background_color: '#121414',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable'
          }
        ]
      }
    })
  ],
  server: {
    watch: {
      ignored: ['**/public/**']
    }
  }
})
