<template>
  <div class="crm-about-view">
    <header class="crm-about-view__header">
      <h1 class="crm-about-view__title">О приложении CRM</h1>
    </header>

    <div class="crm-about-view__content">
      <section class="crm-about-view__section">
        <h2>Назначение приложения</h2>
        <p>
          Это мини-CRM приложение демонстрирует возможности современной системы управления
          взаимоотношениями с клиентами. Оно позволяет отслеживать клиентов, сделки и
          воронку продаж для эффективного ведения бизнеса.
        </p>
      </section>

      <section class="crm-about-view__section">
        <h2>Функциональные возможности</h2>
        <ul>
          <li>Управление клиентами - добавление, редактирование и удаление записей клиентов</li>
          <li>Управление сделками - отслеживание текущих и потенциальных сделок</li>
          <li>Воронка продаж - визуализация стадий продаж с возможностью перетаскивания</li>
          <li>Панель управления - обзор ключевых метрик и активности</li>
          <li>Поиск и фильтрация - быстрый доступ к нужной информации</li>
        </ul>
      </section>

      <section class="crm-about-view__section">
        <h2>Технологии</h2>
        <p>
          Приложение разработано с использованием современных технологий:
        </p>
        <ul>
          <li>Vue 3 с Composition API</li>
          <li>TypeScript</li>
          <li>Pinia для управления состоянием</li>
          <li>Vue Router для навигации</li>
          <li>Vite для быстрой сборки</li>
          <li>Feature-Sliced Design архитектура</li>
        </ul>
      </section>

      <section class="crm-about-view__section">
        <h2>Архитектура</h2>
        <p>
          Проект следует архитектуре Feature-Sliced Design (FSD), которая обеспечивает:
        </p>
        <ul>
          <li>Четкое разделение ответственности</li>
          <li>Легкую масштабируемость</li>
          <li>Повторное использование компонентов</li>
          <li>Удобство командной разработки</li>
        </ul>
      </section>
    </div>
  </div>
</template>

<script setup lang="ts" />
