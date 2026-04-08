# Задание 7.2: RPC через RabbitMQ

## Цель

Реализовать интерактивный симулятор RPC-паттерна поверх RabbitMQ с визуализацией sequence diagram. Клиент отправляет запрос с заголовками `reply-to` и `correlation-id`, сервер публикует ответ в очередь `reply-to`, клиент сопоставляет ответ по `correlationId`.

## Требования

1. Реализовать тип `RpcCall` с полями:
   - `correlationId: string` — уникальный идентификатор вызова
   - `requestBody: string` — тело запроса
   - `replyTo: string` — имя временной очереди ответа
   - `status: 'pending' | 'processing' | 'completed' | 'timeout'`
   - `response: string | null` — ответ сервера
   - `startedAt: number`, `completedAt: number | null`

2. Реализовать тип `RpcStep` — union-тип шагов sequence diagram:
   - `client-send`, `server-recv`, `server-process`, `server-reply`, `client-recv`, `timeout`
   - Каждый шаг содержит `correlationId`; шаги `client-send`, `server-reply`, `client-recv` также содержат данные сообщения

3. Реализовать функцию `sendRpc()`:
   - Генерировать уникальный `correlationId` (формат `corr-XXXXXX`)
   - Генерировать имя временной очереди `amq.gen-XXXXXXXX` для `reply-to`
   - Последовательно добавлять шаги в sequence diagram с задержками: `client-send` → `server-recv` (500 мс) → `server-process` (600 мс) → `server-reply` (800 мс) → `client-recv` (500 мс)
   - При включённом флаге `simulateTimeout` — через 4 000 мс добавлять шаг `timeout` вместо нормального ответа

4. Предоставить 3 операции на выбор: "Получить курс USD", "Подтвердить заказ", "Вычислить скидку".

5. Отображать список активных вызовов с полями `correlationId`, `reply-to`, статус, ответ, RTT в мс.

6. Отображать sequence diagram — последовательность шагов с иконками и цветами для CLIENT, SERVER, rpc.queue.

7. Реализовать кнопку "Очистить" для сброса состояния.

## Проверочный список

- [ ] Функция `generateCorrelationId()` возвращает строку вида `corr-XXXXXX`
- [ ] `sendRpc()` создаёт `RpcCall` и добавляет его в список вызовов
- [ ] Шаги sequence diagram появляются с правильными задержками
- [ ] При включённом `simulateTimeout` через 4 сек появляется шаг `timeout`
- [ ] Список активных вызовов показывает `correlationId`, `reply-to` и статус
- [ ] После завершения вызова отображается ответ и время RTT
- [ ] Кнопка "Очистить" сбрасывает и вызовы, и sequence diagram

## Как проверить себя

1. Выбери операцию "Подтвердить заказ" и нажми "Отправить RPC".
2. В sequence diagram должны последовательно появиться 5 шагов: `client-send` → `server-recv` → `server-process` → `server-reply` → `client-recv`.
3. В списке активных вызовов статус вызова должен смениться с `PENDING` на `PROCESSING`, затем на `COMPLETED`.
4. В карточке вызова должны отображаться: `correlationId`, имя `reply-to` очереди, ответ `{ "status": "confirmed", "eta": "2h" }` и значение RTT.
5. Включи флаг "Симулировать timeout" и отправь ещё один вызов — через 4 сек должен появиться шаг `TIMEOUT` вместо ответа.
