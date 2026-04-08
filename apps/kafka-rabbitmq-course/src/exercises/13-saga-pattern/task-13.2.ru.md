# Задание 13.2: Saga Orchestration

## Цель

Реализовать визуализатор **Orchestration Saga** с центральным оркестратором. В отличие от Choreography, здесь один Orchestrator знает все шаги, отправляет команды сервисам и ждёт их ответов. Визуализация — SVG-диаграмма, где оркестратор в центре, а сервисы вокруг него. Стрелки между ними анимируются при передаче команд и ответов.

## Требования

1. Переиспользовать тип `StepStatus` из задания 13.1.
2. Объявить интерфейс `OrchestratorStep` с полями: `id: string`, `service: string`, `command: string`, `reply: string`, `compensationCommand: string`, `x: number`, `y: number`, `color: string`, `status: StepStatus`.
3. Объявить константу `ORCH_STEPS` — массив из 4 шагов: PaymentService (команда `ProcessPayment`, ответ `PaymentProcessed`), InventoryService (`ReserveInventory` / `InventoryReserved`), ShippingService (`ScheduleShipping` / `ShippingScheduled`), NotificationService (`SendConfirmation` / `ConfirmationSent`). Каждому шагу задать координаты `x`, `y` для расположения на SVG (по 2 сервиса в ряд).
4. Объявить интерфейс `Arrow` с полями: `fromX`, `fromY`, `toX`, `toY`: `number`, `color: string`, `label: string`, `reverse?: boolean`.
5. Реализовать состояния: `steps`, `failAt` (по умолчанию 1), `running`, `currentArrow: Arrow | null`, `log`, `phase`, `sagaState: string` (текстовый статус оркестратора: `'STARTED'`, `'EXECUTING: ...'`, `'COMPENSATING'`, `'COMPLETED'`, `'ROLLED_BACK'`), `abortRef`.
6. Реализовать вспомогательные функции:
   - `getCenter(x, y, w, h)` — возвращает центральную точку прямоугольника.
   - `makeArrow(step, label, reverse, color)` — строит объект `Arrow` от оркестратора к сервису (или обратно при `reverse: true`).
7. Реализовать функцию `runSaga`:
   - Для каждого шага: сначала `setCurrentArrow` со стрелкой **от оркестратора к сервису** (синяя), статус → `'running'`, добавить лог `[ORCHESTRATOR] -> Service: Command`.
   - При успехе: `setCurrentArrow` со стрелкой **от сервиса к оркестратору** (зелёная), статус → `'success'`, добавить лог `[OK] Service -> Orchestrator: Reply`.
   - При ошибке (`idx === failAt`): стрелка красная с лейблом `'ERROR'`, статус → `'failed'`, запустить компенсацию.
   - Компенсация: для успешных шагов в обратном порядке — стрелка оранжевая с `compensationCommand`, затем серая с `'ACK'`.
8. Реализовать `reset`.
9. Отрисовать SVG-диаграмму (`viewBox="0 0 500 360"`):
   - Оркестратор — прямоугольник в центре (координаты `ORCHESTRATOR = { x: 170, y: 155 }`), меняет цвет фона в зависимости от `phase`.
   - 4 сервиса — прямоугольники с цветными рамками, меняющимися по статусу.
   - Анимированная стрелка `currentArrow` — `<line>` с `strokeDasharray="6 3"` и CSS-анимацией `dashMove`.
   - Текстовый лейбл над стрелкой.
10. Добавить `<select>` для выбора ошибки (опция "Без ошибок" + по одной на каждый сервис).
11. Добавить кнопку-тоггл "Запустить" / "Сбросить".
12. Добавить бейдж с текущим `sagaState` — меняет цвет фона при `phase === 'compensating'`.
13. Добавить лог событий (тёмный блок): строки `[ORCHESTRATOR]` синим, `[OK]` зелёным, `[ERROR]` красным, `[COMPENSATE]` оранжевым.

## Чеклист

- [ ] Интерфейс `OrchestratorStep` объявлен с полями координат и команд
- [ ] `ORCH_STEPS` содержит 4 сервиса с командами, ответами и компенсациями
- [ ] Интерфейс `Arrow` объявлен
- [ ] `getCenter` корректно вычисляет центр прямоугольника
- [ ] `makeArrow` строит стрелки в обоих направлениях
- [ ] `sagaState` обновляется на каждом шаге
- [ ] SVG содержит оркестратор и 4 узла сервисов
- [ ] Анимированная стрелка отображается при активном шаге
- [ ] Цвет фона оркестратора меняется при `phase === 'compensating'`
- [ ] Бейдж `sagaState` меняет цвет по фазе
- [ ] При компенсации стрелки идут в обратном порядке (оранжевые)
- [ ] Лог разделяет строки по цвету в зависимости от префикса
- [ ] `currentArrow` сбрасывается в `null` после завершения

## Как проверить себя

1. Откройте задание — SVG-диаграмма показывает оркестратор в центре и 4 сервиса вокруг него.
2. Выберите ошибку на InventoryService и нажмите "Запустить".
3. Первая синяя стрелка летит от Orchestrator к PaymentService с лейблом `ProcessPayment`.
4. Зелёная стрелка обратно с лейблом `PaymentProcessed`, PaymentService становится зелёным.
5. Следующая синяя стрелка к InventoryService — он переходит в статус ошибки.
6. Оркестратор переходит в COMPENSATING (фон становится красноватым, бейдж краснеет).
7. Оранжевая стрелка к PaymentService с лейблом `RefundPayment`, затем серая обратно с `ACK`.
8. Лог: строки `[ORCHESTRATOR]` синие, `[OK]` зелёные, `[ERROR]` красные, `[COMPENSATE]` оранжевые.
9. При успехе (без ошибок) `sagaState` = `COMPLETED`, оркестратор — зелёный фон.
