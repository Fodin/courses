# Задание 5.2: CORS

## 🎯 Цель

Понять механизм CORS: простые запросы, preflight (OPTIONS), credentials и настройку cors middleware.

## Требования

1. Объясните, что такое CORS и зачем он нужен (same-origin policy браузера)
2. Покажите простой запрос: `Origin` header -> `Access-Control-Allow-Origin` response
3. Покажите preflight запрос: OPTIONS с `Access-Control-Request-Method/Headers` -> `Allow-*` ответ
4. Объясните credentials: `fetch({ credentials: 'include' })` + `Access-Control-Allow-Credentials: true`
5. Покажите настройку cors middleware: origin, methods, allowedHeaders, exposedHeaders, credentials, maxAge

## Чеклист

- [ ] Same-origin policy объяснён: домен:порт:протокол
- [ ] Простой запрос: Origin -> Allow-Origin + Vary: Origin
- [ ] Preflight: OPTIONS -> 204 + Allow-Methods/Headers + Max-Age
- [ ] Credentials: нельзя использовать `Allow-Origin: *` с credentials: true
- [ ] Конфигурация cors(): массив origins, методы, заголовки, maxAge

## Как проверить себя

Нажмите "Запустить" и убедитесь, что: показан механизм simple request и preflight, объяснены ограничения credentials, конфигурация cors middleware полная.
