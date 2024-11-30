import { fileURLToPath, URL } from 'node:url'
import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { VitePWA } from 'vite-plugin-pwa'


// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    vue({
    }),
    VitePWA({
      registerType: 'autoUpdate',
      workbox: {
        clientsClaim: true,
        skipWaiting: true,
        navigateFallbackDenylist:[ new RegExp("auth")],
      },
      //devOptions: {
      //  enabled: true
      //},
      manifest: {
        name: 'Cloudbadger',
        short_name: 'Cloudbadger',
        description: 'Cloudbadger.biz',
        theme_color: '#ffffff',
        icons: [
          {
            src: 'pwa/ios/192.png',
            sizes: '192x192',
            type: 'image/png'
          },
          {
            src: 'pwa/ios/144.png',
            sizes: '144x144',
            type: 'image/png'
          },
          {
            src: 'pwa/ios/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any'
          },
          {
            src: 'pwa/ios/512.png',
            sizes: '512x512',
            type: 'image/png'
          },
          {
            src:  'pwa/ios/512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable'
          }
        ]
      }
    })
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    }
  }
})
