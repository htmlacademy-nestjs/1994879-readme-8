# Readme. Простой движок для блога

## О проекте

«Readme» — это простой headless-движок для блога, построенный с помощью микросервисной архитектуры и современного фреймворка Nest.js. Проект состоит из нескольких микросервисов [(схема проекта)](#схема-проекта), каждый сервис решает одну задачу.

## Инструкции для запуска проекта

_в разработке_

```
npm run start

docker compose --file ./apps/account/docker-compose.yml --project-name readme-account --env-file ./apps/account/.env up -d

docker compose --file ./apps/blog/docker-compose.yml --project-name readme-blog --env-file ./apps/blog/.env up -d
```

## Схема проекта

![specification.drawio](./specification.drawio.png)
