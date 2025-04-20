import { defineConfig } from 'vite'

export default defineConfig({
  base: './', // important for relative asset paths
  server: {
    open: true,
  },
  build: {
    outDir: 'dist',
    rollupOptions: {
      input: './index.html',
    }
  }
});
