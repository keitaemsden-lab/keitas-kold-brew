import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  base: '/',
  test: { environment: 'jsdom', globals: true, setupFiles: ['./src/test/setup.js'] },
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'favicon.svg', 'icons/*.png', 'fonts/*.woff2'],
      manifest: {
        name: "Keita's Kold Brew",
        short_name: 'Kold Brew',
        description: 'Cold brew maths drawn to scale: concentrate, dilution, cold foam and the steep timer.',
        start_url: '/',
        display: 'standalone',
        orientation: 'portrait',
        background_color: '#E3E7E4',
        theme_color: '#E3E7E4',
        icons: [
          {
            src: '/icons/icon-192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: '/icons/icon-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/icons/icon-maskable-512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
      },
    }),
  ],
});
