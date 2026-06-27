import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Sitio multipágina: la invitación principal (index.html) y las propuestas
// alternativas (propuesta-2.html, propuesta-3.html) se construyen todas.
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        propuesta2: resolve(__dirname, 'propuesta-2.html'),
        propuesta3: resolve(__dirname, 'propuesta-3.html'),
      },
    },
  },
});
