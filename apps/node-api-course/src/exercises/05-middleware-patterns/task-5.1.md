# Задание 5.1: Logging Middleware

## 🎯 Цель

Реализовать middleware для логирования запросов: замер времени, correlation ID, структурированные JSON-логи.

## Требования

1. Реализуйте middleware, который замеряет время обработки через `process.hrtime.bigint()`
2. Генерируйте/извлекайте correlation ID: `req.headers['x-request-id'] || uuid()`
3. Логируйте после отправки ответа через `res.on('finish', ...)`
4. Покажите логи разных уровней: INFO (2xx), WARN (4xx), ERROR (5xx)
5. Продемонстрируйте структурированное логирование в JSON (для ELK/Grafana)

## Чеклист

- [ ] Время замеряется через `process.hrtime.bigint()` для точности в наносекундах
- [ ] Correlation ID сохраняется в `req.requestId` и добавляется в `X-Request-Id` header
- [ ] Логирование происходит после `res.on('finish')`, когда известен status code
- [ ] Уровень лога зависит от status code: 2xx=INFO, 4xx=WARN, 5xx=ERROR
- [ ] JSON-лог содержит: level, time, requestId, method, url, statusCode, responseTime, userId

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: каждый запрос логируется с requestId и временем, уровень лога соответствует статус-коду, JSON-формат содержит все необходимые поля.
