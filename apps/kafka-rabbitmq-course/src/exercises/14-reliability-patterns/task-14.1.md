# Задание 14.1: Retry с Exponential Backoff

## Цель

Реализовать интерактивный визуализатор стратегии **Exponential Backoff** для повторной отправки сообщений. Компонент показывает timeline задержек до запуска и симулирует ход обработки: при исчерпании всех попыток сообщение уходит в DLQ, при успехе — фиксируется доставка.

## Требования

1. Объявить интерфейс `RetryAttempt` с полями: `attempt: number`, `status: 'pending' | 'running' | 'failed' | 'success' | 'dlq'`, `delay: number`, `timestamp: number`.
2. Объявить состояния компонента: `maxRetries` (ползунок 1–6, по умолчанию 4), `baseDelay` (1–5, по умолчанию 1), `multiplier` (1–4, по умолчанию 2), `attempts: RetryAttempt[]`, `running: boolean`, `successOnAttempt: number | 'never'` (по умолчанию `'never'`), `dlq: boolean`, `successDelivered: boolean`, `timerRef` через `useRef`.
3. Реализовать функцию `calcDelay(attempt: number): number` — формула `baseDelay * multiplier^(attempt - 1)`.
4. Реализовать функцию `totalTime(): number` — сумма всех задержек от 1 до `maxRetries`.
5. Реализовать функцию `handleStart`:
   - Инициализировать массив `RetryAttempt[]` длиной `maxRetries + 1` (первая попытка — `status: 'running'`, остальные — `'pending'`, у первой `delay: 0`, у остальных `delay: calcDelay(i + 1)`).
   - Запустить `runAttempt(0)` — асинхронную рекурсию с задержкой через `setTimeout`.
   - Каждая попытка: сначала статус `'running'`, через `resolveDelay = 600ms` — результат.
   - Если `successOnAttempt !== 'never'` и `idx + 1 >= Number(successOnAttempt)` — статус `'success'`, `setSuccessDelivered(true)`, `setRunning(false)`.
   - Иначе — статус `'failed'`; если это последняя попытка (`nextIdx > maxRetries`) — `setDlq(true)`, `setRunning(false)`; иначе через `nextDelay * speed` вызвать `runAttempt(nextIdx)`.
6. Реализовать функцию `handleReset`: очищает `timerRef`, сбрасывает все состояния.
7. Объявить словари `statusColor: Record<string, string>` и `statusLabel: Record<string, string>` для 5 статусов: `pending`, `running`, `failed`, `success`, `dlq`.
8. Отрисовать панель настроек (4 слайдера/селектор): `maxRetries`, `baseDelay`, `multiplier`, `successOnAttempt`. Все контролы заблокированы во время `running`, изменение вызывает `handleReset`.
9. Отрисовать **Timeline задержек** (до запуска): горизонтальные бары пропорциональной ширины для каждой попытки. Первая попытка — метка "немедленно", остальные — `+Xs`.
10. Отрисовать **Ход симуляции** (после старта): список карточек `RetryAttempt` с цветными рамками, анимацией `pulse` для `status === 'running'`, меткой задержки и статусом.
11. Отрисовать блок **DLQ** (при `dlq === true`) — оранжевая рамка с текстом о перемещении в DLQ и суммарном времени.
12. Отрисовать блок **"Сообщение доставлено успешно"** (при `successDelivered === true`) — зелёная рамка.
13. Добавить кнопки "Запустить симуляцию" / "Сбросить". Кнопка старта заблокирована при `running`.
14. Добавить CSS-анимацию `@keyframes pulse` для индикаторов статуса.

## Чеклист

- [ ] Интерфейс `RetryAttempt` объявлен с 4 полями
- [ ] `calcDelay` корректно реализует формулу `baseDelay * multiplier^(attempt - 1)`
- [ ] `totalTime` суммирует задержки всех попыток
- [ ] `handleStart` создаёт массив attempts с правильными начальными статусами
- [ ] Рекурсия `runAttempt` последовательно обходит попытки с задержками
- [ ] При `successOnAttempt !== 'never'` симуляция завершается успехом на нужной попытке
- [ ] При исчерпании попыток `dlq` становится `true`
- [ ] `handleReset` очищает таймер через `timerRef.current` и сбрасывает все состояния
- [ ] Слайдеры заблокированы при `running`, изменение вызывает сброс
- [ ] Timeline отображает пропорциональные бары для каждой попытки
- [ ] Ход симуляции отображает карточки с анимацией для `running`
- [ ] Блок DLQ появляется только при `dlq === true`
- [ ] Блок успеха появляется только при `successDelivered === true`
- [ ] CSS `@keyframes pulse` добавлен

## Как проверить себя

1. Откройте задание — должны отображаться 4 контрола и Timeline с 5 попытками (baseDelay=1, multiplier=2).
2. Timeline должен показывать задержки: попытка 1 — немедленно, попытка 2 — +1s, 3 — +2s, 4 — +4s, 5 — +8s. Суммарное время — 15s.
3. Нажмите "Запустить симуляцию" при `successOnAttempt = 'never'`. Все попытки последовательно переходят в `failed`, появляется оранжевый блок DLQ с текстом о 5 попытках.
4. Сбросьте, выберите "Успех на попытке: #3", запустите снова. Попытки 1 и 2 переходят в `failed`, попытка 3 — в `success`, появляется зелёный блок успеха.
5. Измените `multiplier` на 3, `baseDelay` на 2. Timeline должен пересчитаться: попытка 2 — +2s, 3 — +6s, 4 — +18s.
6. Нажмите "Сбросить" во время выполнения — симуляция останавливается, все попытки возвращаются в исходное состояние.
