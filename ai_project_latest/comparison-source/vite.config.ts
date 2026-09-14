import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'url';
import path from 'path';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

export default defineConfig({
  root: __dirname,
  base: './',
  publicDir: false,
  plugins: [react(), tailwindcss()],
  build: {
    outDir: path.resolve(__dirname, 'comparison-build'),
    emptyOutDir: true,
    rollupOptions: {
      input: path.resolve(__dirname, 'comparison.html')
    }
  }
});

