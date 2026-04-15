# Задание 13.3. Event processing pipeline

## Цель

Реализовать три этапа FP-пайплайна обработки событий. Каждый этап — pure функция с единственной обязанностью.

## Требования

1. Реализуй `enrich(event: RawEvent): EnrichedEvent` — добавляет к событию без мутации:
   - `sessionId`: `` `sess_${event.userId}_${Math.floor(event.timestamp / 60000)}` ``
   - `region`: `['RU', 'EU', 'US'][parseInt(event.userId.replace(/\D/g, '') || '0', 10) % 3]`
   - `processed`: `true`
2. Реализуй `validateEvent(event: EnrichedEvent): Either<string, EnrichedEvent>`:
   - `event.id` пустая строка → `Left('missing id')`
   - `event.userId` пустая строка → `Left('missing userId')`
   - `event.timestamp` равен 0 → `Left('missing timestamp')`
   - `event.type === 'purchase'` и `typeof event.data.amount !== 'number'` → `Left('purchase missing amount')`
   - Иначе → `Right(event)`
3. Реализуй `routeEvent(event: EnrichedEvent): { channel: string; event: EnrichedEvent }`:
   - `'click'` → `channel: 'analytics'`
   - `'purchase'` → `channel: 'billing'`
   - `'pageview'` → `channel: 'metrics'`

## Чеклист

- [ ] `enrich` не мутирует входящий объект, использует spread
- [ ] `enrich` корректно вычисляет `sessionId` с числовой частью userId
- [ ] `enrich` корректно вычисляет `region`: userId `'user1'` → индекс 1 → `'EU'`, `'user3'` → индекс 3%3=0 → `'RU'`
- [ ] `validateEvent` отклоняет события с пустым `id`
- [ ] `validateEvent` отклоняет `purchase` без числового `amount` в `data`
- [ ] `validateEvent` пропускает корректные события как `Right`
- [ ] `routeEvent` возвращает `{ channel: 'billing', event }` для purchase
- [ ] После 100 событий — dashborad показывает `validEvents < totalEvents` (≈7% невалидных)

## Как проверить себя

1. Нажми "10 событий" — dashboard показывает распределение по типам (clicks/purchases/pageviews).
2. Нажми "100 событий" — счётчик "Validate passed" должен быть меньше "received" (невалидные события отфильтрованы).
3. Проверь stage "Route": счётчик passed совпадает с validate.passed (все прошедшие валидацию маршрутизируются).
4. Нажми "Сбросить" — все счётчики обнуляются, dashboard очищается.
5. Добавь `console.log(routeEvent({ ...someEvent, type: 'purchase' }))` — должно вернуть `{ channel: 'billing', event: ... }`.
