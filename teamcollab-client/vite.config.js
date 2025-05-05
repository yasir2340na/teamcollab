import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000', // local backend for development
    },
  },
  build: {
    outDir: 'dist', // optional but conventional for Vercel
  },
});
