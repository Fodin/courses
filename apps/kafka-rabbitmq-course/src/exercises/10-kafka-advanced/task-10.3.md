# Задание 10.3: Exactly-Once — транзакции Kafka

## Цель

Реализовать пошаговый симулятор транзакционного API Kafka. Студент разберёт два сценария: успешный коммит с атомарной записью в три топика и прерывание транзакции при сбое с откатом частичных записей. Симулятор наглядно покажет роль Transaction Coordinator и топика `__transaction_state`.

## Требования

1. Определить тип `TxState` — union type из 7 значений: `'idle' | 'begin' | 'produce' | 'commit' | 'abort' | 'committed' | 'aborted'`.
2. Определить интерфейс `TxMessage` с полями: `topic: string`, `partition: number`, `key: string`, `value: string`, `txId: string`.
3. Определить тип объекта шага транзакции с полями: `state: TxState`, `label: string`, `description: string`, `coordinatorAction: string`.
4. Создать массив `TX_MESSAGES` из 3 сообщений — атомарная запись в топики `payments` (partition 0), `inventory` (partition 2), `notifications` (partition 1). Все с `txId: 'tx-001'`.
5. Создать массив `TX_STEPS` (успешный коммит, 3 шага):
   - **beginTransaction()** — Coordinator регистрирует TX в `__transaction_state` с epoch для фенсинга зомби-продюсеров
   - **produce()** — атомарная запись в 3 топика, сообщения видны только в `read_committed` после commit
   - **commitTransaction()** — Coordinator пишет `PREPARE_COMMIT`, затем `COMMITTED`, данные становятся видимы
6. Создать массив `ABORT_STEPS` (сбой и откат, 3 шага):
   - **beginTransaction()** — аналогично TX_STEPS, но `txId: 'tx-002'`
   - **produce()** — записано только первое сообщение, симуляция сбоя producer
   - **abortTransaction()** — Coordinator пишет `ABORTED`, отправляет abort markers во все партиции
7. Реализовать состояния: `mode: 'commit' | 'abort'`, `stepIndex: number` (начально -1), `producerConfig: Record<string, string>`.
8. Поле `producerConfig` содержит: `transactional_id`, `enable_idempotence: 'true'`, `acks: 'all'`, `retries: '2147483647'`.
9. Переключатель режима: две кнопки "Successful Commit" и "Failure & Abort". При переключении сбрасывать `stepIndex` в -1.
10. Реализовать функцию `handleNext`: увеличивает `stepIndex` на 1 (не выходя за границы массива шагов). Кнопка показывает "Начать симуляцию" при `stepIndex === -1` и "Следующий шаг" иначе.
11. Реализовать функцию `handleReset`: сбрасывает `stepIndex` в -1.
12. Реализовать функцию `getMessageOpacity(msgIndex)`:
    - при `stepIndex < 1` — возвращает `0.3`
    - в режиме `abort` для сообщений с `msgIndex > 0` при `stepIndex >= 1` — возвращает `0.2`
    - иначе при `stepIndex >= 2` — `1`, при `stepIndex < 2` — `0.7`
13. Реализовать функцию `getMessageBorderColor(msgIndex)`:
    - при `stepIndex < 1` — `'#333'`
    - в режиме `abort` для `msgIndex > 0` — `'#6b1a1a'` (красный, не записан)
    - при `stepIndex >= 2` — зелёный для commit (`'#2d6a4f'`), красный для abort (`'#6b1a1a'`)
    - иначе — оранжевый (`'#7a4f00'`)
14. Вычислить `finalState`: если `stepIndex === steps.length - 1` — `'COMMITTED'` для commit или `'ABORTED'` для abort.
15. Отображать Producer Config в виде пар ключ-значение с заменой `_` на `.` в ключах.
16. Отображать список из 3 сообщений с `topic [partition N]`, ключом и значением. При abort — для сообщений 2 и 3 показывать метку "НЕ ЗАПИСАН (сбой)".
17. Если `finalState` задан — показывать блок с итоговым статусом транзакции (зелёный COMMITTED / красный ABORTED).
18. Отображать список шагов Transaction Coordinator: пройденные шаги — зелёный фон, текущий — синий, будущие — тёмный. При `stepIndex >= i` показывать `coordinatorAction`.
19. При наличии `currentStep` — показывать описание текущего шага (`description`).
20. Информационный блок: как работает `__transaction_state` (50 партиций, выбор координатора по `hash(transactional.id) % 50`), isolation levels `read_committed` vs `read_uncommitted`.

## Чеклист

- [ ] Тип `TxState` содержит все 7 значений
- [ ] Интерфейс `TxMessage` содержит все 5 полей
- [ ] `TX_MESSAGES` содержит 3 сообщения в разные топики с одним `txId`
- [ ] `TX_STEPS` содержит 3 шага успешного коммита с `description` и `coordinatorAction`
- [ ] `ABORT_STEPS` содержит 3 шага прерывания с корректными описаниями
- [ ] `producerConfig` содержит `transactional_id`, `enable_idempotence`, `acks`, `retries`
- [ ] Кнопки переключения режима сбрасывают `stepIndex`
- [ ] `handleNext` не выходит за границы массива шагов
- [ ] `getMessageOpacity` возвращает правильные значения для обоих режимов
- [ ] `getMessageBorderColor` различает commit/abort и пройденные/непройденные шаги
- [ ] В режиме abort сообщения 2 и 3 помечены "НЕ ЗАПИСАН (сбой)"
- [ ] `finalState` блок появляется только на последнем шаге
- [ ] Шаги Transaction Coordinator подсвечиваются по прогрессу
- [ ] Описание `currentStep.description` обновляется на каждом шаге
- [ ] Информационный блок о `__transaction_state` и isolation levels присутствует

## Как проверить себя

1. В режиме "Successful Commit" нажимайте "Начать симуляцию" → "Следующий шаг" → "Следующий шаг". На каждом шаге должны появляться описание в панели и запись `coordinatorAction` в блоке Coordinator.
2. После третьего шага должен появиться зелёный блок "Транзакция: COMMITTED". Все три сообщения должны иметь зелёную границу и opacity 1.
3. Переключитесь в "Failure & Abort". Пройдите все три шага. На шаге 2 сообщения inventory и notifications должны иметь пометку "НЕ ЗАПИСАН (сбой)". После третьего шага — красный блок "Транзакция: ABORTED".
4. Нажмите "Сброс" — `stepIndex` сбрасывается, все сообщения полупрозрачны (opacity 0.3).
5. Переключитесь между режимами — убедитесь, что `stepIndex` сбрасывается при каждом переключении.
