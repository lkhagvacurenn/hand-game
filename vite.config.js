import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // ensure relative path for assets
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
  }
});
