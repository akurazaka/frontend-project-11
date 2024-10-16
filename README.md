### Hexlet tests and linter status:
[![Actions Status](https://github.com/akurazaka/frontend-project-11/actions/workflows/hexlet-check.yml/badge.svg)](https://github.com/akurazaka/frontend-project-11/actions) [![Maintainability](https://api.codeclimate.com/v1/badges/a5d6692f47bb22480f63/maintainability)](https://codeclimate.com/github/akurazaka/frontend-project-11/maintainability)


# RSS Aggregator

Описание
RSS Aggregator — это приложение для сбора и отображения контента из различных RSS-каналов. С его помощью пользователи могут подписываться на интересующие их RSS-ленты и получать последние обновления в удобном формате.

RSS (Really Simple Syndication) — это стандартный формат, который позволяет сайтам делиться своими обновлениями (статьи, новости, посты) в структурированном виде.

[Демо-приложение](https://frontend-project-11-1bx6dmcj8-akurazakas-projects.vercel.app/)

## Особенности

- Поддержка добавления нескольких RSS-каналов
- Автоматическое обновление контента с интервалом
- Удобное и интуитивное управление подписками
- Отображение уведомлений о состоянии загрузки каналов
- Локализация (например, поддержка русского языка)

## Установка

1. Склонируйте репозиторий на ваш компьютер:

```bash
git clone https://github.com/akurazaka/frontend-project-11.git
```

2. Перейдите в папку проекта:

```bash
cd frontend-project-11
```

3. Установите все необходимые зависимости:

```bash
npm install
```

## Запуск
Локальный сервер для разработки
Для запуска приложения в режиме разработки используйте команду:

```bash
npm run dev
```

## Сборка проекта
Чтобы собрать проект для продакшена, используйте команду:

```bash
npm run build
```
После этого собранные файлы будут находиться в папке dist.

## Линтинг
Для проверки кода на соответствие стандартам используйте ESLint:

```bash
npm run lint
```