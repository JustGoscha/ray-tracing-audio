import { defineConfig } from 'vite';

export default defineConfig({
  root: '.',
  build: {
    outDir: 'dist',
    sourcemap: true,
    minify: true
  },
  server: {
    open: true
  }
}); 