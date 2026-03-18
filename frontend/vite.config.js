import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    chunkSizeWarningLimit: 2000, // Increase chunk size warning limit (in kBs)
    rollupOptions: {
      output: {
        manualChunks: {
          // Split vendor and runtime code into separate chunks
          vendor: ['react', 'react-dom', 'react-router-dom'],
          // You can add more manual chunks for large dependencies
          // For example, if you're using large libraries:
          // mui: ['@mui/material', '@emotion/react', '@emotion/styled'],
        },
      },
    },
  },
  // Enable code splitting
  esbuild: {
    // This will help with tree-shaking
    minify: true,
  },
  server: {
    proxy: {
      '/api': 'https://dev.amankumarr.in'
    }
  }
})
