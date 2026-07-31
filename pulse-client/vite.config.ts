import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

const standalone = process.env.STANDALONE === '1';

export default defineConfig({
  plugins: [react()],
  base: './',
  build: {
    outDir: standalone ? 'demo' : 'dist',
    cssCodeSplit: false,
    rollupOptions: {
      output: {
        inlineDynamicImports: true,
      },
    },
  },
});
