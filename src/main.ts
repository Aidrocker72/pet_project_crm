import './assets/styles/main.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'
import apiClient from './api/api'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.provide('apiClient', apiClient)

app.mount('#app')


fetch('/icons/sprite.svg')
  .then(response => response.text())
  .then(data => {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;

    const svgElement = tempDiv.querySelector('svg');
    if (svgElement) {
      svgElement.style.display = 'none';
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.appendChild(svgElement);
      } else {
        document.body.appendChild(svgElement);
      }
    }
  })
  .catch(error => console.error('Ошибка при загрузке SVG спрайта:', error));
