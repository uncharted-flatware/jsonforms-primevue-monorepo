// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'JsonFormsPrimeVue',
      fileName: (format) => `jsonforms-primevue.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: ['vue', '@jsonforms/core', '@jsonforms/vue', 'primevue'],
      output: {
        globals: {
          vue: 'Vue',
          '@jsonforms/core': 'JsonFormsCore',
          '@jsonforms/vue': 'JsonFormsVue',
          primevue: 'PrimeVue',
        },
        exports: 'named'
      },
    },
  },
});
