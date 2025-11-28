import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react(), makeTagger()],
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
  server: {
    watch: {
      ignored: ['**/{node_modules,.git,dist,logs,temp}/**'],
      usePolling: true,
      interval: 300,
    },
    port: 3000,
    open: false,
  }
});
import { makeTagger } from "@fex/miaoda-tagger";