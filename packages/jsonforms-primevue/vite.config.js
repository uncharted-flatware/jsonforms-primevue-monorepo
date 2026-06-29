// vite.config.js
import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';

export default defineConfig({
  plugins: [vue()],
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
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
        globals(id) {
          if (id === 'vue') return 'Vue';
          if (id === '@jsonforms/core') return 'JsonFormsCore';
          if (id === '@jsonforms/vue') return 'JsonFormsVue';
          if (id === 'primevue') return 'PrimeVue';
          if (id.startsWith('primevue/')) {
            const segment = id.slice('primevue/'.length).split('/').pop() ?? '';
            return segment.charAt(0).toUpperCase() + segment.slice(1);
          }
          return id;
        },
        exports: 'named'
      },
    },
  },
});
