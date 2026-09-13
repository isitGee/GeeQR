import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Relative base so a single build works on GitHub Pages project sites
// (https://isitgee.github.io/geeqr/) and on root domains (Vercel, etc.).
export default defineConfig({
  plugins: [react()],
  base: './',
  server: {
    host: '0.0.0.0',
    allowedHosts: ['localhost', '.e2b.app'],
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
  },
});
