import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Admin hub di-deploy sebagai Render Static Site (root path).
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: { port: 5174 },
});
