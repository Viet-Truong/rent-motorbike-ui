import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  css: {
    modules: {
      scopeBehaviour: 'local',
    },
  },
  build: {
    outDir: 'dist',
  },
  // server: {
  //   host: '192.168.80.18',
  // },
});
