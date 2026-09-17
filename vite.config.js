import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Panel admin booking, di-deploy ke Vercel sebagai SPA (root path).
export default defineConfig({
  base: '/',
  plugins: [react()],
  server: { port: 5174 },
});
