# Деплой Vue Mini CRM на GitHub Pages

## Настройка проекта для деплоя

Проект настроен для автоматического деплоя на GitHub Pages с помощью GitHub Actions. При пуше в ветку `main` запускается workflow, который:

1. Устанавливает зависимости
2. Собирает проект
3. Деплоит на GitHub Pages в ветку `gh-pages`

## Конфигурация

- В `vite.config.ts` добавлена опция `base: '/vue-mini-crm/'` для корректной работы приложения на GitHub Pages
- Workflow находится в файле `.github/workflows/deploy.yml`
- Деплой осуществляется в папку `dist`, которая генерируется при сборке

## Ручной запуск

Для ручного запуска workflow можно использовать `workflow_dispatch` событие в интерфейсе GitHub.

## Доступ к приложению

После успешного деплоя приложение будет доступно по адресу: `https://aidrocker72.github.io/pet_project_crm/`