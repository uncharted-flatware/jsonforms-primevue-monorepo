import '@jsonforms/vue-vanilla/vanilla.css';
import 'primevue/resources/themes/aura-dark-indigo/theme.css'
import 'primeflex/primeflex.css';


import App from '@/App.vue';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';
import Tooltip from 'primevue/tooltip';

const app = createApp(App);

app.use(PrimeVue, { ripple: false });
app.directive('tooltip', Tooltip);


app.mount('#app');
