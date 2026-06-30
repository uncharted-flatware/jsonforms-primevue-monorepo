import '@jsonforms/vue-vanilla/vanilla.css';
import '@uncharted.software/jsonforms-primevue/style.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import App from '@/App.vue';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import theme from './theme';
import Tooltip from 'primevue/tooltip';

const app = createApp(App);

app.use(PrimeVue, { 
    ripple: false,
    theme: {
        preset: theme,
        options: {
            prefix: '',
            cssLayer: true,
            darkModeSelector: '.dark-mode',
        }
    }
});
app.directive('tooltip', Tooltip);


app.mount('#app');
