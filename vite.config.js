import { resolve } from 'node:path';
import { defineConfig } from 'vite';

// Sitio multipágina: la invitación principal (index.html, antes "propuesta 3")
// y la propuesta alternativa (propuesta-2.html).
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
