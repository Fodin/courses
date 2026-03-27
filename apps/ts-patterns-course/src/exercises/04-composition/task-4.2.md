# Задание 4.2: Middleware

## Цель

Реализовать HTTP-подобный middleware pipeline с типобезопасной цепочкой обработки запросов.

## Требования

1. Создайте интерфейсы `HttpRequest` и `HttpResponse`:
   - `HttpRequest`: `method`, `url`, `headers`, опциональный `body`
   - `HttpResponse`: `status`, `body`, `headers`
2. Создайте тип `Middleware`: функция `(request, next) => HttpResponse`
3. Создайте функцию `createPipeline(...middlewares)` — собирает middleware в цепочку
4. Реализуйте три middleware:
   - `loggingMiddleware` — добавляет заголовок `X-Log` с информацией о запросе
   - `authMiddleware` — проверяет заголовок `authorization`, возвращает 401 если нет
   - `corsMiddleware` — добавляет CORS-заголовки к ответу
5. Продемонстрируйте авторизованный и неавторизованный запросы

## Чеклист

- [ ] Интерфейсы `HttpRequest` и `HttpResponse` определены
- [ ] Тип `Middleware` корректно типизирует `next`
- [ ] `createPipeline` собирает цепочку через `reduceRight`
- [ ] `authMiddleware` прерывает цепочку при отсутствии токена
- [ ] `loggingMiddleware` добавляет информацию о запросе
- [ ] `corsMiddleware` добавляет CORS-заголовки
- [ ] Оба сценария (с токеном и без) демонстрируются

## Как проверить себя

- Запрос с `authorization` должен пройти все middleware и вернуть статус 200
- Запрос без `authorization` должен вернуть статус 401 и не дойти до handler
