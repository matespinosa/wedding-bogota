import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Sitio multipágina: invitación principal y propuesta alternativa.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        propuesta2: resolve(__dirname, 'propuesta-2.html'),
      },
    },
  },
});
