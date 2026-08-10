import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@headless-media/core': path.resolve(__dirname, '../../packages/media-core/src/index.ts'),
      '@headless-media/react': path.resolve(__dirname, '../../packages/media-react/src/index.ts'),
      '@headless-media/ui-react': path.resolve(__dirname, '../../packages/media-ui-react/src/index.ts'),
      '@headless-media/native': path.resolve(__dirname, '../../packages/media-native/src/index.ts'),
      '@headless-media/ui-native': path.resolve(__dirname, '../../packages/media-ui-native/src/index.ts'),
    },
  },
  server: {
    port: 3000,
    open: true,
  },
  build: {
    outDir: path.resolve(__dirname, '../../dist'),
    emptyOutDir: true,
    sourcemap: true,
  },
});
