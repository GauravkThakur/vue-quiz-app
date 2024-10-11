import { createApp } from 'vue';
import { createPinia } from 'pinia';
import PrimeVue from 'primevue/config';
import Aura from '@primevue/themes/aura';
import PiniaPlugin from 'pinia-plugin-persistedstate';
import ConfirmationService from 'primevue/confirmationservice';

import App from './App.vue';

import './assets/main.css';

const app = createApp(App);
const pinia = createPinia();
app.use(PrimeVue, {
  theme: {
    preset: Aura,
    options: {
      darkModeSelector: '.my-app-dark'
    }
  }
});
pinia.use(PiniaPlugin);
app.use(pinia);
app.use(ConfirmationService);

app.mount('#app');
