import { defineConfig } from 'vite';

export default defineConfig({
  base: '/ray-tracing-audio/',
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