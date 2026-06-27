// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  build: {
    lib: {
      entry: './src/index.ts',
      name: 'JsonFormsPrimeVue',
      fileName: (format) =>
        format === 'umd' ? 'jsonforms-primevue.cjs' : `jsonforms-primevue.${format}.js`,
    },
    sourcemap: true,
    rollupOptions: {
      external: [
        'vue',
        '@jsonforms/core',
        '@jsonforms/vue',
        // Externalize ALL PrimeVue imports - both base and submodules
        /^primevue\/.*/,
        'primevue'
      ],
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
