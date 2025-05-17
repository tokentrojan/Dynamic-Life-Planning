import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import { VitePWA } from 'vite-plugin-pwa';

// https://vite.dev/config/
export default defineConfig({
  plugins: [

    
    react(),
    VitePWA({
      manifest: {

        icons:[
          {
            src:"/dlp.png",
            sizes:"512x512",
            type:"image/png",
            purpose:"any maskable"
          }
        ]

      }

    })

  ],
})
