import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Shorten imports using '@' for `src/`
    },
  },
  base: '', // Ensures assets are linked with relative paths in production
  build: {
    outDir: 'dist', // Output directory for Vite build
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // Entry point for Vite build
      },
      external: ['electron'], // Mark electron as an external dependency
      output: {
        globals: {
          electron: 'electron', // Ensure electron APIs are accessible globally
        },
      },
    },
  },
  server: {
    port: 5173, // Development server port
  },
});
