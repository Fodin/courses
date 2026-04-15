# Задание 13.2. FP API-клиент

## Цель

Построить composable API-клиент на основе каррирования и pure middleware-функций. Запрос — это данные (объект), middleware — чистые функции трансформации.

## Требования

1. Реализуй каррированный `request(method)(url)(headers)(body)`, возвращающий объект `ApiRequest { method, url, headers, body }`. Определи ярлыки `get = request('GET')` и `post = request('POST')`.
2. Реализуй middleware `withAuth(token)(req)` — возвращает новый `ApiRequest` с добавленным заголовком `Authorization: Bearer {token}`. Не мутирует `req`.
3. Реализуй middleware `withContentType(req)` — возвращает новый `ApiRequest` с добавленным заголовком `Content-Type: application/json`. Не мутирует `req`.
4. Реализуй `mockSend(req, scenario)` — возвращает `Promise<Either<string, unknown>>` с задержкой 400ms:
   - `'server-error'` → `Left('500 Internal Server Error')`
   - `'not-found'` → `Left('404 Not Found')`
   - `'success'` → `Right(MOCK_DATA[req.url] ?? { ok: true })`

## Чеклист

- [ ] `request('GET')('/api/users')({})(undefined)` возвращает `{ method: 'GET', url: '/api/users', headers: {}, body: undefined }`
- [ ] `withAuth('tok123')(req)` добавляет `Authorization: Bearer tok123` в headers, не трогает остальные поля
- [ ] `withContentType(req)` добавляет `Content-Type: application/json`, не мутирует входящий `req`
- [ ] `withAuth` и `withContentType` можно применять одновременно: `withContentType(withAuth(tok)(req))` содержит оба заголовка
- [ ] `mockSend` возвращает `Promise` с задержкой (не синхронный результат)
- [ ] `mockSend` при `'success'` возвращает `Right` с данными из `MOCK_DATA` по `req.url`
- [ ] `mockSend` при `'server-error'` и `'not-found'` возвращает `Left` с соответствующим сообщением

## Как проверить себя

1. Выбери `GET /api/users/1`, сценарий "Успешный" — pipeline показывает 5 зелёных шагов, финальный результат: данные пользователя.
2. Выбери `POST /api/orders`, сценарий "Успешный" — step 1 "Build request" должен показывать `Content-Type: application/json` и `Authorization` в headers.
3. Выбери любой endpoint, сценарий "Ошибка сервера" — pipeline останавливается на шаге 2 (Send), остальные шаги остаются pending.
4. Выбери `GET /api/products`, сценарий "Успешный" — финальный результат: массив продуктов.
5. Убедись, что `withAuth` не мутирует объект запроса: два вызова `withAuth` с разными токенами на одном базовом `req` дают разные headers.
