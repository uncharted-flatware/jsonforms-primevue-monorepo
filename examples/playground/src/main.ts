import '@jsonforms/vue-vanilla/vanilla.css';
import 'primevue/resources/themes/lara-dark-indigo/theme.css'
import 'primeflex/primeflex.css';


import App from '@/App.vue';
import { createApp } from 'vue';
import PrimeVue from 'primevue/config';

const app = createApp(App);

app.use(PrimeVue, { ripple: false });


app.mount('#app');
