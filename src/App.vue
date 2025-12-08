<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <div class="app">
    <header class="app-header">
      <div class="app-header-content">
        <h1 class="app-title">CRM Система</h1>
        <nav class="app-nav">
          <RouterLink to="/" class="nav-link">Панель управления</RouterLink>
          <RouterLink to="/customers" class="nav-link">Клиенты</RouterLink>
          <RouterLink to="/deals" class="nav-link">Сделки</RouterLink>
          <RouterLink to="/pipeline" class="nav-link">Воронка</RouterLink>
          <RouterLink to="/about" class="nav-link">О программе</RouterLink>
        </nav>
      </div>
    </header>

    <main class="app-main">
      <RouterView />
    </main>
  </div>
</template>
