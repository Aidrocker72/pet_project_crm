import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'

// https://vite.dev/config/
export default defineConfig({
  base: '/pet_project_crm/',
  plugins: [
    vue(),
    vueDevTools(),
  ],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url))
    },
    extensions: ['.js', '.ts', '.jsx', '.tsx', '.vue', '.json', '.mjs']
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: ` @use "@/assets/styles/variables.scss";
                          @use "@/assets/styles/mixins.scss";`
      }
    }
  },
  define: {
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: false,
  },
  // Добавляем настройки для CSP, чтобы избежать проблем при сборке
  build: {
    rollupOptions: {
      output: {
        // Убедимся, что CSP-политика не добавляется неправильно
        manualChunks: undefined,
      }
    }
  }
})
