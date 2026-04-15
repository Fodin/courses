# Задание 8.3: FP Data Pipeline — цепочка чистых функций

## Цель

Построить аналитический пайплайн обработки событий из 6 этапов, каждый из которых —
чистая функция, возвращающая Either. Ошибка на любом этапе прерывает цепочку.

## Требования

1. Объявить тип Either как `{ tag: 'Left'; value: L } | { tag: 'Right'; value: R }`
2. Реализовать `pipeRight(value)`, `pipeLeft(value)`, `pipeChain(either, fn)` — Either-примитивы
3. Реализовать 6 этапов пайплайна:
   - `parseJSON(input)` — парсит JSON-строку, возвращает `Either<string, RawEvent[]>`
   - `validateEvents(events)` — фильтрует невалидные события, возвращает `Either<string, ValidEvent[]>`
   - `enrichEvents(events)` — добавляет `dayOfWeek`, `isWeekend`, возвращает `Either<string, EnrichedEvent[]>`
   - `groupByCategory(events)` — группирует по полю `category`, возвращает `Either<string, GroupedEvents>`
   - `aggregateGroups(groups)` — считает `count`, `totalAmount`, `avgAmount`, возвращает `Either<string, AggregatedResult[]>`
   - `formatResults(results)` — форматирует числа для отображения
4. Все этапы — чистые функции (без console.log, без мутаций)
5. В компоненте: текстовое поле для JSON, кнопка запуска, визуализация каждого этапа (вход/выход/ошибка), итоговая таблица

## Чеклист

- [ ] Either-примитивы корректно реализованы
- [ ] `pipeChain` не вызывает fn если either === Left
- [ ] `parseJSON` возвращает Left при невалидном JSON
- [ ] `validateEvents` пропускает события без обязательных полей, но не фейлит если есть хотя бы одно валидное
- [ ] `enrichEvents` добавляет `dayOfWeek` (Пн-Вс) и `isWeekend` (boolean)
- [ ] `aggregateGroups` сортирует результаты по убыванию `totalAmount`
- [ ] При ошибке на этапе N — этапы N+1...6 отображаются как "пропущен"
- [ ] Итоговая таблица показывает результаты только при успехе всего пайплайна

## Как проверить себя

```ts
const input = JSON.stringify([
  { timestamp: '2024-01-15T10:00:00Z', type: 'purchase', userId: 'u1', amount: '1200', category: 'Electronics' },
  { timestamp: '2024-01-16T14:30:00Z', type: 'purchase', userId: 'u2', amount: '350', category: 'Books' },
])

const result = pipeChain(
  pipeChain(
    pipeChain(parseJSON(input), validateEvents),
    enrichEvents
  ),
  groupByCategory
)

// result.tag === 'Right'
// result.value['Electronics'].length === 1
// result.value['Books'].length === 1

// Невалидный JSON:
const bad = pipeChain(parseJSON('not json'), validateEvents)
// bad.tag === 'Left'
// bad.value содержит сообщение об ошибке парсинга
```
