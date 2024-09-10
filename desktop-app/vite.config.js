import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { resolve } from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'), // Easier imports using '@' for `src/`
    },
  },
  build: {
    outDir: 'dist', // Output directory for the build
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'), // React entry point
      },
    },
  },
  server: {
    port: 5173, // Adjust the port if needed
  },
});
