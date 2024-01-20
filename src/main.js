import { createApp } from 'vue'
import PrimeVue from 'primevue/config';

import 'primevue/resources/themes/lara-light-green/theme.css'

import './assets/main.css';

import App from './App.vue'

createApp(App).use(PrimeVue).mount('#app')
