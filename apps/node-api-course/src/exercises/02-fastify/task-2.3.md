# Задание 2.3: Lifecycle хуки

## 🎯 Цель

Понять жизненный цикл запроса в Fastify: хуки onRequest, preParsing, preValidation, preHandler, preSerialization, onSend, onResponse и onError.

## Требования

1. Визуализируйте полный lifecycle запроса в Fastify (от Incoming Request до onResponse)
2. Продемонстрируйте прохождение запроса через все хуки с замером времени
3. Объясните назначение каждого хука и типичные use-cases (логирование, auth, авторизация, метрики)
4. Покажите хук `onError` -- side-effect при ошибке (логирование), не заменяет `setErrorHandler`

## Чеклист

- [ ] Диаграмма lifecycle показывает все хуки в правильном порядке
- [ ] Каждый хук описан с типичным use-case
- [ ] Симуляция проходит запрос через: onRequest -> preHandler [auth, rbac] -> Handler -> preSerialization -> onSend -> onResponse
- [ ] `onError` объяснён как side-effect хук (не замена error handler)
- [ ] Показано общее время выполнения запроса

## Как проверить себя

Нажмите "Запустить" и проследите прохождение GET /api/users/42 через все хуки lifecycle. Каждый шаг должен показывать действие и время выполнения.
