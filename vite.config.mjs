import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from 'tailwindcss';
import autoprefixer from 'autoprefixer';

const here = path.dirname(fileURLToPath(import.meta.url));

// The React app lives in `frontend/`; everything else (backend, api) stays at root.
// Tailwind and PostCSS configs are pinned explicitly: Tailwind only auto-discovers
// `tailwind.config.*` from the process CWD, which is the repo root on Vercel.
export default defineConfig({
  root: 'frontend',
  plugins: [react()],
  css: {
    postcss: {
      plugins: [
        tailwindcss({ config: path.join(here, 'frontend', 'tailwind.config.mjs') }),
        autoprefixer(),
      ],
    },
  },
  server: {
    port: 3000,
    proxy: { '/api': { target: 'http://localhost:5000', changeOrigin: true } },
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
});
