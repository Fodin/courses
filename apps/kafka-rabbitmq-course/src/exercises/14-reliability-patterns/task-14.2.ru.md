# Задание 14.2: Idempotency — дедупликация

## Цель

Реализовать интерактивную демонстрацию **Idempotency Layer** — системы дедупликации сообщений по Message ID. Компонент позволяет сравнить поведение при включённом и выключенном фильтре дедупликации, наглядно показывая последствия повторной обработки дублей.

## Требования

1. Объявить тип `MsgStatus`: `'queued' | 'checking' | 'duplicate' | 'processed'`.
2. Объявить интерфейс `IncomingMessage` с полями: `id: string`, `payload: string`, `isDuplicate: boolean`.
3. Объявить интерфейс `TrackedMessage`, расширяющий `IncomingMessage`: добавить поля `status: MsgStatus` и `index: number`.
4. Объявить константу `INCOMING_MESSAGES: IncomingMessage[]` — массив из 8 сообщений, где msg-001, msg-002, msg-003 встречаются дважды (вторые вхождения имеют `isDuplicate: true`):
   - `{ id: 'msg-001', payload: 'Order #1001 created', isDuplicate: false }`
   - `{ id: 'msg-002', payload: 'Payment $99.00', isDuplicate: false }`
   - `{ id: 'msg-001', payload: 'Order #1001 created', isDuplicate: true }`
   - `{ id: 'msg-003', payload: 'Shipment dispatched', isDuplicate: false }`
   - `{ id: 'msg-002', payload: 'Payment $99.00', isDuplicate: true }`
   - `{ id: 'msg-004', payload: 'Invoice generated', isDuplicate: false }`
   - `{ id: 'msg-003', payload: 'Shipment dispatched', isDuplicate: true }`
   - `{ id: 'msg-005', payload: 'Email notification', isDuplicate: false }`
5. Объявить состояния: `deduplicationEnabled: boolean` (по умолчанию `true`), `trackedMessages: TrackedMessage[]`, `seenIds: Set<string>`, `processedIds: string[]`, `duplicatesBlocked: number`, `processedCount: number`, `running: boolean`, `currentIndex: number`.
6. Реализовать функцию `handleReset` — сбрасывает все состояния в начальные значения.
7. Реализовать функцию `handleStep` — обрабатывает одно следующее сообщение:
   - Добавляет сообщение в `trackedMessages` со статусом `'checking'`.
   - Через 600ms: если `deduplicationEnabled && seenIds.has(msg.id)` → статус `'duplicate'`, `duplicatesBlocked++`; иначе → статус `'processed'`, добавить ID в `seenIds` и `processedIds`, `processedCount++`.
   - Инкрементировать `currentIndex`.
8. Реализовать функцию `handleRunAll` — автоматически обрабатывает все оставшиеся сообщения одно за другим с задержкой 350ms между ними.
9. Объявить словари `statusColor: Record<MsgStatus, string>` и `statusLabel: Record<MsgStatus, string>` для 4 статусов.
10. Отрисовать переключатель `deduplicationEnabled` — кнопка "Dedup ON" / "Dedup OFF" с цветным фоном (зелёный при включённом, красный при выключенном). Нажатие вызывает `handleReset` и переключает флаг.
11. Отрисовать двухколоночный grid:
    - Левая колонка: **Входящий поток** — список `trackedMessages`, каждое сообщение с цветной рамкой по статусу, бейджем "дубль" при `isDuplicate: true`, анимацией `pulse` при `status === 'checking'`.
    - Правая колонка: **Idempotency Store** (визуализация `processedIds` как бейджей) + блок **Статистика** (3 строки: обработано уникальных, заблокировано дублей, всего входящих).
12. Отрисовать финальный блок после завершения (`isDone`):
    - При `deduplicationEnabled === false` — красный блок с предупреждением о повторной обработке.
    - При `deduplicationEnabled === true` — зелёный блок с подтверждением корректной дедупликации.
13. Добавить 3 кнопки: "Шаг (следующее сообщение)", "Запустить всё", "Сбросить". Первые две заблокированы при `running || isDone`.
14. Добавить CSS-анимацию `@keyframes pulse`.

## Чеклист

- [ ] `MsgStatus` объявлен с 4 значениями
- [ ] `INCOMING_MESSAGES` содержит 8 сообщений (5 уникальных + 3 дублированных)
- [ ] `handleStep` корректно проверяет `seenIds` перед обработкой
- [ ] При `deduplicationEnabled: true` дублированные сообщения получают статус `'duplicate'`
- [ ] При `deduplicationEnabled: false` дублированные сообщения получают статус `'processed'`
- [ ] `handleRunAll` обрабатывает все сообщения с задержкой 350ms
- [ ] Кнопка деdup меняет цвет (зелёный/красный) и вызывает `handleReset`
- [ ] Idempotency Store показывает только уникальные обработанные ID
- [ ] Статистика корректно показывает `processedCount` и `duplicatesBlocked`
- [ ] Бейдж "дубль" отображается для сообщений с `isDuplicate: true`
- [ ] Анимация `pulse` работает при `status === 'checking'`
- [ ] Финальный блок меняется в зависимости от `deduplicationEnabled`
- [ ] `isDone = currentIndex >= INCOMING_MESSAGES.length`

## Как проверить себя

1. Откройте задание — должен отображаться переключатель "Dedup ON" с зелёным фоном.
2. Нажмите "Шаг" 8 раз при включённой дедупликации. msg-001, msg-002, msg-003 (второе вхождение) должны получить статус "Дубликат" (красный). Idempotency Store должен содержать 5 уникальных ID.
3. Статистика: "Обработано уникальных: 5", "Заблокировано дублей: 3". Финальный зелёный блок.
4. Нажмите "Dedup OFF" — состояние сбрасывается. Нажмите "Запустить всё". Теперь все 8 сообщений получают статус "Обработано". Финальный красный блок с предупреждением о 3 повторных обработках.
5. Проверьте, что кнопки "Шаг" и "Запустить всё" заблокированы после обработки всех 8 сообщений.
