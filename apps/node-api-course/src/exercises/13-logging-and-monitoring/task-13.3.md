# Задание 13.3: Health Checks & OpenAPI

## 🎯 Цель

Освоить health checks для Kubernetes (liveness/readiness) и документирование API через OpenAPI/Swagger.

## Требования

1. Создайте liveness endpoint (`/health/live`) -- простой ответ "процесс жив"
2. Создайте readiness endpoint (`/health/ready`) -- проверка всех зависимостей (DB, Redis, disk)
3. Реализуйте функции проверки зависимостей с responseTime и status (up/down)
4. Настройте swagger-jsdoc + swagger-ui-express для автодокументации
5. Покажите JSDoc аннотации @openapi для описания endpoints

## Чеклист

- [ ] Liveness всегда возвращает 200 (пока процесс жив)
- [ ] Readiness возвращает 503 если хоть одна зависимость недоступна
- [ ] Каждая зависимость проверяется с responseTime
- [ ] Swagger UI доступен на /docs
- [ ] Endpoints описаны через @openapi JSDoc аннотации

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: liveness отвечает 200, readiness проверяет зависимости и возвращает 503 при проблемах, Swagger генерирует документацию.
