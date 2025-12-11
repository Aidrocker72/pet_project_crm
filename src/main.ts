import './assets/styles/main.scss';

import { createApp } from 'vue'
import { createPinia } from 'pinia'

import App from './App.vue'
import router from './router'

const app = createApp(App)

app.use(createPinia())
app.use(router)

app.mount('#app')

// Загрузка SVG спрайта
fetch('/icons/sprite.svg')
  .then(response => response.text())
  .then(data => {
    // Создаем временный div для парсинга SVG
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = data;

    // Находим SVG элемент и безопасно добавляем его в DOM
    const svgElement = tempDiv.querySelector('svg');
    if (svgElement) {
      svgElement.style.display = 'none';
      // Добавляем в #app вместо document.body, чтобы избежать проблем с CSP
      const appElement = document.getElementById('app');
      if (appElement) {
        appElement.appendChild(svgElement);
      } else {
        document.body.appendChild(svgElement);
      }
    }
  })
  .catch(error => console.error('Ошибка при загрузке SVG спрайта:', error));
