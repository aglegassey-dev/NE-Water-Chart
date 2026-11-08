import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa'

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        name: 'HatchWatch',
        short_name: 'HatchWatch',
        theme_color: '#2D3A1F',
        background_color: '#1A2410',
        display: 'standalone',
        orientation: 'portrait',
        icons: [
          { src: '/icon-192.png', sizes: '192x192', type: 'image/png' },
          { src: '/icon-512.png', sizes: '512x512', type: 'image/png' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,webmanifest}'],
        // /hunt/ is a standalone app (Freeport Hunt Map) — don't serve the SPA shell for it
        navigateFallbackDenylist: [/^\/hunt/],
        maximumFileSizeToCacheInBytes: 3 * 1024 * 1024,
        runtimeCaching: [
          {
            // Hunt Map tiles: cache-first so viewed and downloaded areas work with no signal.
            // Cache name must match TILE_CACHE in public/hunt/js/offline.js.
            urlPattern: ({ url }) =>
              ['server.arcgisonline.com', 'basemap.nationalmap.gov', 'carto.nationalmap.gov', 'tile.openstreetmap.org', 'www.mrlc.gov', 'imagery.geoplatform.gov'].includes(url.hostname) ||
              (url.hostname === 'gis.maine.gov' && url.pathname.endsWith('/exportImage')),
            handler: 'CacheFirst',
            options: { cacheName: 'hunt-tiles', cacheableResponse: { statuses: [0, 200] } },
          },
          {
            urlPattern: ({ url }) => url.hostname === 'gis.maine.gov' && url.pathname.endsWith('/identify'),
            handler: 'NetworkFirst',
            options: { cacheName: 'hunt-elevation', networkTimeoutSeconds: 4, expiration: { maxEntries: 500 } },
          },
          {
            urlPattern: ({ url }) => url.hostname === 'api.open-meteo.com',
            handler: 'NetworkFirst',
            options: { cacheName: 'weather', networkTimeoutSeconds: 5, expiration: { maxEntries: 20, maxAgeSeconds: 6 * 3600 } },
          },
        ],
      },
    }),
  ],
})
