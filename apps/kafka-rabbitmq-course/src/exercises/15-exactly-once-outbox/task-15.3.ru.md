# Задание 15.3: CDC (Change Data Capture)

## Цель

Реализовать интерактивный демонстратор **Change Data Capture** в стиле Debezium. Каждое изменение в таблице (INSERT, UPDATE, DELETE) захватывается из WAL (Write-Ahead Log) и публикуется как структурированное CDC-событие в Kafka. Студент видит, как устроено событие: поля `op`, `before`, `after`, `ts`, `topic`.

## Требования

1. Объявить тип `CdcOperation`: `'INSERT' | 'UPDATE' | 'DELETE'`.
2. Объявить интерфейс `CdcRow` с полями `id: number`, `name: string`, `amount: number`.
3. Объявить интерфейс `CdcEvent` с полями `id: number`, `op: CdcOperation`, `before: CdcRow | null`, `after: CdcRow | null`, `ts: string`, `topic: string`.
4. Объявить интерфейс `CdcWalEntry` с полями `lsn: string`, `op: CdcOperation`, `table: string`, `payload: string`.
5. Объявить модульные счётчики `rowIdCounter` и `eventIdCounter` вне компонента (для уникальных id через простой инкремент).
6. Реализовать вспомогательные функции `opColor(op: CdcOperation)` и `opBg(op: CdcOperation)` — возвращают цвет (`#38a169` / `#d69e2e` / `#e53e3e`) и фон (`#f0fff4` / `#fffff0` / `#fff5f5`) в зависимости от операции.
7. Объявить состояния компонента: `rows: CdcRow[]` (начальные данные: 2 строки), `walLog: CdcWalEntry[]`, `cdcEvents: CdcEvent[]`, `editId: number | null`, `editAmount: string`, `lsnRef` через `useRef(1000)`.
8. Реализовать функцию `now()`, возвращающую текущее время в формате `HH:MM:SS`.
9. Реализовать `addWalEntry(op, payload)`: формирует LSN вида `0/1{lsnRef.current++}`, добавляет запись в `walLog` (хранит последние 5 записей через `.slice(-4)`), возвращает LSN.
10. Реализовать `addCdcEvent(event)`: добавляет событие в `cdcEvents` (хранит последние 6 через `.slice(-5)`), автоматически проставляет `id`, `ts` и `topic: 'db.public.orders'`.
11. Реализовать `handleInsert`: создаёт новую строку с `id = rowIdCounter++`, случайным `amount` (50–550), добавляет в `rows`, вызывает `addWalEntry('INSERT', ...)` и `addCdcEvent({ op: 'INSERT', before: null, after: newRow })`.
12. Реализовать `handleUpdate(row)`: при первом клике переводит строку в режим редактирования (`editId = row.id`); при повторном — применяет новое значение `amount`, вызывает `addWalEntry('UPDATE', ...)` и `addCdcEvent({ op: 'UPDATE', before: row, after: updated })`.
13. Реализовать `handleDelete(row)`: удаляет строку из `rows`, вызывает `addWalEntry('DELETE', ...)` и `addCdcEvent({ op: 'DELETE', before: row, after: null })`.
14. Отрисовать левую колонку с таблицей PostgreSQL: заголовок "PostgreSQL: orders", таблица с колонками `id`, `name`, `amount`, `ops`. Кнопки `UPD` / `OK` и `DEL` в каждой строке.
15. Отрисовать под таблицей кнопку "+ INSERT строку".
16. Отрисовать WAL-лог в тёмном блоке: каждая строка — LSN (серый), операция (INSERT зелёный, UPDATE жёлтый, DELETE красный), таблица (голубой), payload (светло-серый).
17. Отрисовать правую колонку с CDC-событиями Kafka (топик `db.public.orders`). Каждое событие — карточка с цветной левой границей по операции, полями `op`, `topic`, `ts`, `before` (красным) и `after` (зелёным). Список в обратном порядке (новые сверху).
18. При пустом списке CDC-событий — плейсхолдер "Измените таблицу, чтобы увидеть CDC-события".

## Чеклист

- [ ] Тип `CdcOperation` и интерфейсы `CdcRow`, `CdcEvent`, `CdcWalEntry` объявлены
- [ ] `opColor` и `opBg` возвращают корректные цвета для INSERT / UPDATE / DELETE
- [ ] Начальные данные содержат 2 строки в `rows`
- [ ] `addWalEntry` формирует LSN и хранит не более 5 последних записей
- [ ] `addCdcEvent` хранит не более 6 последних событий
- [ ] `handleInsert` добавляет строку в `rows` и генерирует WAL + CDC-событие с `before: null`
- [ ] `handleUpdate` при первом клике активирует режим редактирования, при втором — применяет изменения
- [ ] CDC-событие UPDATE содержит оба поля: `before` (старые данные) и `after` (новые)
- [ ] `handleDelete` удаляет строку и генерирует CDC-событие с `after: null`
- [ ] Таблица корректно отображает `<input>` для редактируемой строки
- [ ] WAL-лог в тёмном блоке с цветовым выделением операций
- [ ] CDC-события отображаются в обратном хронологическом порядке
- [ ] Карточка события показывает `before` и `after` в правильных цветах
- [ ] Плейсхолдер отображается при отсутствии событий

## Как проверить себя

1. Откройте задание — таблица содержит 2 строки (Order #1 и Order #2). Правая колонка показывает плейсхолдер.
2. Нажмите "+ INSERT строку". В таблице появляется новая строка со случайным `amount`. В WAL-логе — строка с `INSERT`. В правой колонке — карточка с зелёной границей, `before: null`, `after: { id, name, amount }`.
3. Нажмите `UPD` на любой строке. Поле `amount` превращается в `<input>`. Введите новое значение, нажмите `OK`. В WAL-логе — `UPDATE` с переходом значения `amount: X -> Y`. В CDC-событии — оба поля `before` и `after` с разными суммами.
4. Нажмите `DEL` на любой строке. Строка исчезает. CDC-событие с красной границей, `before: { ... }`, `after: null`.
5. Проведите несколько операций подряд — WAL хранит не более 5 последних записей, CDC — не более 6. Старые записи вытесняются.
6. Убедитесь, что каждое CDC-событие содержит поле `topic: 'db.public.orders'` и текущее время.
