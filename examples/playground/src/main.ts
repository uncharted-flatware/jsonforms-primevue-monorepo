import '@jsonforms/vue-vanilla/vanilla.css';
import 'primeflex/primeflex.css';
import 'primeicons/primeicons.css';

import App from '@/App.vue';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import Tooltip from 'primevue/tooltip';

const app = createApp(App);

app.use(PrimeVue, { 
    ripple: false,
    theme: {
        preset: Aura,
        options: {
            darkModeSelector: false,
            cssLayer: false
        }
    }
});
app.directive('tooltip', Tooltip);


app.mount('#app');
