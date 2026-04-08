# Задание 16.2: Distributed Tracing

## Цель

Реализовать визуализатор **distributed tracing** — waterfall-диаграмму, которая показывает полный путь запроса через несколько сервисов, связанных через Kafka. Задание демонстрирует, как trace ID пробрасывается через брокер и как по spans можно найти узкое место в системе.

## Требования

1. Объявить интерфейс `TraceSpan` с полями: `id: string`, `parentId: string | null`, `service: string`, `operation: string`, `startMs: number`, `durationMs: number`, `status: 'ok' | 'error' | 'slow'`, `tags: Record<string, string>`.
2. Объявить интерфейс `TraceScenario` с полями: `id: string`, `name: string`, `traceId: string`, `spans: TraceSpan[]`.
3. Объявить массив `SCENARIOS` с тремя сценариями:
   - **success** (`traceId: 'abc123def456'`) — 7 spans, все `status: 'ok'`, путь через Service A → Kafka → Service B → Kafka → Service C.
   - **slow** (`traceId: 'ff9900aa1122'`) — 7 spans, span `kafka.consume ← orders` в Service B имеет `status: 'slow'` и `durationMs: 3600`, Service A корневой span помечен `status: 'slow'`.
   - **error** (`traceId: '1234error5678'`) — 4 spans, `processOrder` в Service B имеет `status: 'error'`, тег `error.message` содержит описание ошибки.
4. Объявить константы `SERVICE_COLORS` (цвет для каждого сервиса) и `SPAN_STATUS_COLORS` для `ok / slow / error`.
5. Объявить состояния: `selectedScenario: TraceScenario` (initial: `SCENARIOS[0]`) и `selectedSpan: TraceSpan | null` (initial: `null`).
6. Вычислять `totalMs` — максимальное значение `startMs + durationMs` среди всех spans выбранного сценария.
7. Отрисовать три кнопки выбора сценария. При смене сценария сбрасывать `selectedSpan` в `null`.
8. Отрисовать строку Trace Info: Trace ID, Duration, количество Spans, Status корневого span.
9. Реализовать waterfall-диаграмму в виде таблицы:
   - Колонки: "Операция" (200px) и "Время (0 — {totalMs}ms)".
   - Каждая строка: слева — цветная точка сервиса, название сервиса и операция; справа — позиционированная полоска `left: startPct%`, `width: widthPct%` (минимум 0.5%) с цветом статуса.
   - Kafka-операции (содержат слово `kafka` в имени операции) отображаются с более насыщенным фоном полоски (`${statusColor}50`), остальные — `${statusColor}20`.
   - Внутри полоски — текст с длительностью в миллисекундах.
   - Клик по строке выбирает span; клик по уже выбранному снимает выделение. Выбранная строка подсвечивается.
10. При выбранном span отображать детали под диаграммой: Service + Operation, Start, Duration, Status, все теги в виде бейджей формата `key=value`.
11. Отобразить подсказку под диаграммой о том, что trace ID пробрасывается через Kafka.

## Чеклист

- [ ] Интерфейсы `TraceSpan` и `TraceScenario` объявлены с правильными полями
- [ ] Массив `SCENARIOS` содержит три сценария: `success`, `slow`, `error`
- [ ] Сценарий `slow` — Service B имеет `durationMs: 3600` на `kafka.consume`
- [ ] Сценарий `error` — `processOrder` содержит тег `error.message` с описанием ошибки
- [ ] Константы `SERVICE_COLORS` и `SPAN_STATUS_COLORS` объявлены
- [ ] Кнопки выбора сценария работают, смена сценария сбрасывает выбранный span
- [ ] Строка Trace Info показывает traceId, totalMs, количество spans, статус
- [ ] `totalMs` вычисляется как максимум `startMs + durationMs`
- [ ] Waterfall-диаграмма: полоски позиционируются по `startMs / totalMs`
- [ ] Kafka-операции визуально отличаются от обычных (более насыщенный фон)
- [ ] Клик на строку — span выделяется, клик снова — снимает выделение
- [ ] Детали span показывают все теги в виде бейджей `key=value`
- [ ] Цвет рамки блока деталей соответствует цвету сервиса (`SERVICE_COLORS`)

## Как проверить себя

1. Откройте задание — по умолчанию выбран сценарий "Успешный путь". Диаграмма показывает 7 spans, все зелёного цвета, общая длительность 245ms.
2. Кликните на любой span — под диаграммой появляется блок с тегами. Для Kafka-spans должны быть теги `messaging.system`, `messaging.destination`, `messaging.operation`. Кликните ещё раз — блок исчезает.
3. Переключитесь на "Медленный consumer" — span `kafka.consume ← orders` в Service B должен быть оранжевым и занимать большую часть временной шкалы (~93% ширины). Общая длительность trace — 3850ms.
4. Переключитесь на "Ошибка в Service B" — `processOrder` выделен красным, Trace Info показывает статус `ERROR`. Диаграмма содержит только 4 spans (Service C не получил событие).
5. Убедитесь, что при смене сценария блок деталей скрывается (выбранный span сброшен).
