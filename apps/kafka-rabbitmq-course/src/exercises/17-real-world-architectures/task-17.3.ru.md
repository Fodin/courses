# Задание 17.3: Выбор архитектуры — кейс

## Цель

Реализовать интерактивный тренажёр по выбору архитектуры брокера сообщений. Пользователю предлагается три реальных бизнес-сценария (E-commerce, IoT, Fintech), для каждого нужно выбрать оптимальный брокер и набор паттернов. Компонент оценивает ответ по 10-балльной шкале и даёт развёрнутое объяснение.

## Требования

1. Объявить интерфейс `Scenario` с полями: `id: string`, `title: string`, `description: string`, `requirements: string[]`, `constraints: string[]`, `scale: string`.
2. Объявить интерфейс `ArchOption` с полями: `id: string`, `label: string`, `icon: string`, `description: string`.
3. Объявить интерфейс `Pattern` с полями: `id: string`, `label: string`, `icon: string`, `description: string`.
4. Объявить интерфейс `ScenarioAnswer` с полями: `broker: string`, `patterns: string[]`.
5. Объявить интерфейс `EvaluationResult` с полями: `score: number`, `maxScore: number`, `feedback: string[]`, `verdict: 'excellent' | 'good' | 'partial' | 'poor'`.
6. Объявить массив `SCENARIOS` из 3 сценариев:
   - **E-commerce платформа** (id: `'ecommerce'`): 500 продавцов, 100k пользователей/день, требования — гарантированная доставка команд, исторический лог, несколько потребителей, routing по приоритету.
   - **IoT платформа телеметрии** (id: `'iot'`): 50k датчиков × 1 msg/sec, требования — throughput 50k msg/sec, replay данных, партицирование по device_id, удержание 30 дней.
   - **Банковские переводы** (id: `'fintech'`): 30k переводов/день, требования — exactly-once, Saga с компенсациями, приоритизация, DLQ.
7. Объявить массив `ARCH_OPTIONS` из 4 вариантов брокера: Только Kafka (`'kafka-only'`), Только RabbitMQ (`'rabbitmq-only'`), Гибрид RabbitMQ + Kafka (`'hybrid'`), Apache Pulsar (`'pulsar'`).
8. Объявить массив `PATTERNS` из 8 паттернов: Saga, CQRS, Transactional Outbox, Dead Letter Queue, Event Sourcing, Priority Queue, Competing Consumers, Fan-out / Pub-Sub.
9. Объявить интерфейс `ScoringRule` с полями `broker: string[]`, `patterns: string[]`, `reason: string`.
10. Объявить словарь `SCORING: Record<string, ScoringRule>` с правилами оценки для каждого сценария:
    - `ecommerce`: правильные брокеры — `['hybrid', 'kafka-only']`, паттерны — `['saga', 'outbox', 'dlq', 'fanout', 'priority']`.
    - `iot`: правильные брокеры — `['kafka-only', 'pulsar']`, паттерны — `['competing', 'fanout', 'event-source']`.
    - `fintech`: правильные брокеры — `['rabbitmq-only', 'hybrid']`, паттерны — `['saga', 'dlq', 'outbox', 'priority', 'cqrs']`.
11. Реализовать функцию `evaluateAnswer(scenarioId, answer): EvaluationResult`:
    - За правильный брокер: +4 балла, за неправильный — добавить в `feedback` подсказку с верными вариантами.
    - За каждый верный паттерн: +2 балла (максимум 6), перечислить верные, лишние и пропущенные.
    - Добавить в `feedback` строку с обоснованием из `SCORING[scenarioId].reason`.
    - Вердикт: `'excellent'` (≥9), `'good'` (≥7), `'partial'` (≥4), `'poor'` (<4).
12. Объявить словарь `VERDICT_CONFIG` с `label`, `color`, `bg`, `border` для каждого вердикта.
13. Объявить состояния: `scenarioIdx: number`, `selectedBroker: string`, `selectedPatterns: string[]`, `result: EvaluationResult | null`.
14. Реализовать `handleScenarioChange(idx)`: меняет сценарий, сбрасывает выбор брокера, паттернов и результата.
15. Реализовать `togglePattern(id)`: переключает паттерн в/из `selectedPatterns`, сбрасывает `result`.
16. Реализовать `handleBrokerChange(id)`: устанавливает `selectedBroker`, сбрасывает `result`.
17. Реализовать `handleEvaluate`: если `selectedBroker` и `selectedPatterns` не пустые — вычисляет и устанавливает `result`.
18. Реализовать `handleReset`: сбрасывает `selectedBroker`, `selectedPatterns`, `result`.
19. Отрисовать переключатель сценариев (три кнопки-таба). Активный сценарий выделен синим.
20. Отрисовать карточку сценария с заголовком, описанием, двумя колонками (Требования и Ограничения) и плашкой масштаба.
21. Отрисовать секцию выбора брокера: 4 карточки-кнопки с иконкой, названием и описанием. Выбранная карточка выделена синей рамкой и голубым фоном.
22. Отрисовать секцию выбора паттернов: 8 карточек-кнопок. Выбранные отмечены галочкой, выделены зелёной рамкой.
23. Добавить кнопки "Оценить архитектуру" (заблокирована, пока не выбраны брокер и хотя бы один паттерн) и "Сбросить".
24. Отрисовать блок результата: итоговый балл (score / maxScore), вердикт с цветным фоном, список строк feedback (каждая строка — отдельный абзац).

## Чеклист

- [ ] Интерфейсы `Scenario`, `ArchOption`, `Pattern`, `ScenarioAnswer`, `EvaluationResult` объявлены
- [ ] Массив `SCENARIOS` содержит 3 сценария с полями `requirements`, `constraints`, `scale`
- [ ] Массив `ARCH_OPTIONS` содержит 4 варианта брокера
- [ ] Массив `PATTERNS` содержит 8 паттернов с `id`, `label`, `icon`, `description`
- [ ] Интерфейс `ScoringRule` объявлен
- [ ] Словарь `SCORING` задан для `ecommerce`, `iot`, `fintech` с правильными брокерами и паттернами
- [ ] `evaluateAnswer` даёт 4 балла за брокер и до 6 за паттерны
- [ ] В `feedback` указываются верные, лишние и пропущенные паттерны
- [ ] В `feedback` включается строка `reason` из `SCORING`
- [ ] Вердикт выставляется по четырём порогам (9 / 7 / 4)
- [ ] `VERDICT_CONFIG` задан для всех 4 вердиктов
- [ ] Состояния `scenarioIdx`, `selectedBroker`, `selectedPatterns`, `result` объявлены
- [ ] `handleScenarioChange` сбрасывает выбор при переключении сценария
- [ ] `togglePattern` корректно добавляет и удаляет паттерны
- [ ] `handleEvaluate` не вызывает оценку при пустом брокере или паттернах
- [ ] Переключатель сценариев: активный выделен синим
- [ ] Карточка сценария показывает требования и ограничения двумя колонками
- [ ] Карточки брокеров: выбранная выделена рамкой и фоном
- [ ] Карточки паттернов: выбранные отмечены галочкой
- [ ] Кнопка "Оценить" заблокирована при неполном выборе
- [ ] Блок результата показывает балл, вердикт и список строк feedback

## Как проверить себя

1. Откройте задание — активен первый сценарий (E-commerce), кнопки брокеров и паттернов не выбраны.
2. Кнопка "Оценить архитектуру" заблокирована — нажать нельзя.
3. Выберите брокер "Только Kafka" и паттерны Saga, Fan-out / Pub-Sub. Нажмите "Оценить". Появляется результат: 4 балла за брокер ("kafka-only" входит в правильные), 4 балла за паттерны (2 верных × 2). Вердикт — Good или Partial.
4. Нажмите "Сбросить". Выберите "Гибрид (RabbitMQ + Kafka)" и паттерны Saga, Transactional Outbox, DLQ, Fan-out, Priority Queue. Нажмите "Оценить" — вердикт Excellent, 10/10. В feedback указаны все верные паттерны и обоснование.
5. Переключитесь на сценарий "IoT". Выберите "Только RabbitMQ" — компонент напишет, что брокер не оптимален. Выберите "Только Kafka" + Competing Consumers, Fan-out, Event Sourcing — вердикт Excellent.
6. Переключитесь на "Fintech". Выберите "Только RabbitMQ" + Saga, DLQ, Transactional Outbox, Priority Queue, CQRS — вердикт Excellent.
