# Задание 14.3: Poison Message — карантин

## Цель

Реализовать визуализатор **Poison Message Detection** с карантинной зоной. Компонент симулирует очередь из 4 сообщений (2 нормальных, 2 poison), показывает счётчик попыток доставки, и автоматически отправляет неисправимые сообщения в карантин после достижения лимита.

## Требования

1. Объявить тип `PoisonMsgStatus`: `'queue' | 'processing' | 'failed' | 'quarantine' | 'success'`.
2. Объявить интерфейс `PoisonMessage` с полями: `id: string`, `payload: string`, `deliveryCount: number`, `maxDeliveries: number`, `status: PoisonMsgStatus`, `isPoison: boolean`, `error?: string`, `history: string[]`.
3. Объявить константу `INITIAL_POISON_MESSAGES` — массив из 4 объектов (без `deliveryCount`, `status`, `history`):
   - `{ id: 'msg-A', payload: '{"type":"order","id":42}', maxDeliveries: 3, isPoison: false }`
   - `{ id: 'msg-B', payload: '{"type":"payment","amount":null}', maxDeliveries: 3, isPoison: true, error: 'NullPointerException: amount is null' }`
   - `{ id: 'msg-C', payload: '{"type":"email","to":"user@example.com"}', maxDeliveries: 3, isPoison: false }`
   - `{ id: 'msg-D', payload: 'INVALID_JSON{{{{', maxDeliveries: 3, isPoison: true, error: 'JsonParseException: unexpected character' }`
4. Объявить состояния: `maxDeliveries: number` (слайдер 1–5, по умолчанию 3), `messages: PoisonMessage[]` (инициализируется из `INITIAL_POISON_MESSAGES`), `selectedMsg: string | null`, `processing: boolean`, `autoStep: boolean`, `autoRef: React.MutableRefObject`.
5. Реализовать функцию `resetMessages(md?: number)` — сбрасывает `messages` из `INITIAL_POISON_MESSAGES` с `deliveryCount: 0`, `status: 'queue'`, `history: []`, применяет переданный `maxDeliveries`.
6. Реализовать функцию `processNext` (через `useCallback`):
   - Найти первое сообщение со статусом `'queue'` или `'failed'`.
   - Установить ему `status: 'processing'`, `deliveryCount + 1`, добавить в `history` строку `Попытка #N — обработка...`.
   - Через 700ms определить результат: если `isPoison`:
     - если `deliveryCount >= maxDeliveries` → статус `'quarantine'`, добавить в `history` строки с ошибкой и `Достигнут лимит (N). → Карантин`.
     - иначе → статус `'failed'`, добавить строку с ошибкой и `Возврат в очередь для повтора...`.
   - Если `!isPoison` → статус `'success'`, добавить строку `Попытка #N — успешно обработано`.
7. Реализовать функцию `toggleAuto` — запускает/останавливает интервал (900ms) с вызовом `processNext`. Автоматически останавливается когда нет активных сообщений (`status === 'queue' || status === 'failed'`).
8. Объявить словари `statusColor: Record<PoisonMsgStatus, string>` и `statusLabel: Record<PoisonMsgStatus, string>` для 5 статусов.
9. Вычислить производные: `quarantined` — сообщения со статусом `'quarantine'`, `succeeded` — со статусом `'success'`, `active` — со статусами `'queue' | 'failed' | 'processing'`, `isDone = active.length === 0 && !processing`.
10. Отрисовать панель настроек: слайдер `maxDeliveries` (1–5), подпись "После N неудачных попыток — карантин". Изменение вызывает `resetMessages`.
11. Отрисовать двухколоночный grid:
    - Левая колонка: **Список сообщений** — карточки с кликом для выбора, цветной рамкой по статусу, бейджем "poison" при `isPoison: true`, анимацией `pulse` при `status === 'processing'`, визуальным delivery counter (полоски: красные при isPoison, зелёные при !isPoison, серые — незаполненные).
    - Правая колонка: **Инспектор** (если `selectedMsg` — показать payload, ошибку, историю попыток) + **Карантин** (список сообщений) + **Успешно обработано** (бейджи).
12. Отрисовать итоговый блок при `isDone` — фиолетовый фон с подсчётом успешных и карантинных.
13. Добавить кнопки: "Следующий шаг", "Авто" / "Стоп", "Сбросить". Первые две заблокированы при `isDone`.
14. Добавить CSS-анимацию `@keyframes pulse`.

## Чеклист

- [ ] `PoisonMsgStatus` объявлен с 5 значениями
- [ ] `PoisonMessage` содержит поле `history: string[]`
- [ ] `INITIAL_POISON_MESSAGES` содержит 2 нормальных и 2 poison сообщения
- [ ] `processNext` находит первое сообщение в статусе `'queue'` или `'failed'`
- [ ] При каждом шаге `deliveryCount` увеличивается на 1
- [ ] Poison message после `maxDeliveries` попыток получает статус `'quarantine'`
- [ ] Нормальное сообщение с первой попытки получает статус `'success'`
- [ ] `history` накапливает строки каждой попытки
- [ ] Клик по карточке выбирает сообщение для инспектора
- [ ] Инспектор показывает payload, ошибку (если есть) и историю попыток
- [ ] Визуальный delivery counter: красные полоски для poison, зелёные для нормальных
- [ ] Карантин-зона заполняется по мере отправки poison messages
- [ ] `toggleAuto` останавливается когда `active.length === 0`
- [ ] Слайдер `maxDeliveries` вызывает `resetMessages` с новым значением
- [ ] Итоговый блок появляется при `isDone`

## Как проверить себя

1. Откройте задание — 4 карточки в статусе "Очередь". msg-B и msg-D помечены бейджем "poison".
2. Нажмите "Следующий шаг" несколько раз. msg-A обрабатывается с 1-й попытки (статус "Успех"). msg-B получает "Ошибка" и возвращается в очередь.
3. После 3-й попытки msg-B должен получить статус "Карантин" (фиолетовый). В карантин-зоне справа появится msg-B с текстом ошибки.
4. Нажмите на карточку msg-B — в инспекторе должна отобразиться история: 3 попытки с ошибкой и строка "Достигнут лимит (3). → Карантин".
5. Нажмите "Авто" — автоматически обработаются все оставшиеся сообщения. msg-C → успех, msg-D → карантин.
6. Итоговый блок: "2 сообщений обработано успешно, 2 poison messages изолированы в карантин."
7. Измените `maxDeliveries` на 1 — состояние сбрасывается. Нажмите "Авто" — оба poison message сразу попадают в карантин с первой попытки.
