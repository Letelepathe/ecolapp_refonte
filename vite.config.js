import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      manifest: {
        id: "/",
        short_name: "ecolapp",
        name: "ecolapp",
        icons: [
          {
            src: "/icons/icon-192x192.png",
            sizes: "192x192",
            type: "image/png"
          },
          {
            src: "/icons/icon-512x512.png",
            sizes: "512x512",
            type: "image/png"
          }
        ],
        start_url: "/",
        display: "standalone",
        theme_color: "#1976d2",
        background_color: "#ffffff",
        screenshots: [
          {
            src: "/screenshots/screenshot1.png",
            sizes: "640x480",
            type: "image/png"
          },
          {
            src: "/screenshots/screenshot2.png",
            sizes: "1280x720",
            type: "image/png"
          }
        ]
      },
      injectManifest: {
        swSrc: 'src/sw/service-worker.js',
        swDest: 'service-worker.js',
      },
      workbox: {
        maximumFileSizeToCacheInBytes: 5242880,  // Set to 5 MB
      },
    }),
  ],
  server:{
    host: true,
  },
});
