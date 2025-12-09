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
    const div = document.createElement('div');
    div.innerHTML = data;
    div.style.display = 'none';
    document.body.appendChild(div);
  })
  .catch(error => console.error('Ошибка при загрузке SVG спрайта:', error));
