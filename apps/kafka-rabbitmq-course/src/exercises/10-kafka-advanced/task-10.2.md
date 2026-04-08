# Задание 10.2: Compacted Topics

## Цель

Реализовать интерактивный симулятор Log Compaction в Kafka. Студент увидит, как Kafka хранит историю изменений ключей, что такое tombstone-запись и как compaction оставляет только последние версии каждого ключа, удаляя устаревшие дубликаты.

## Требования

1. Определить интерфейс `KafkaRecord` с полями: `offset: number`, `key: string`, `value: string | null`, `timestamp: string`, `isTombstone?: boolean`.
2. Создать массив `INITIAL_RECORDS` из 9 записей с разными ключами (`user:1`, `user:2`, `user:3`, `user:4`), где:
   - `user:1` присутствует 3 раза (три разных города), последний — Sochi
   - `user:2` присутствует 3 раза, последний — Krasnodar
   - `user:3` присутствует 2 раза: обычная запись и tombstone (`value: null`)
   - `user:4` присутствует 1 раз
3. Реализовать функцию `runCompaction(records)`: проходит по всем записям и оставляет только последнюю запись для каждого ключа (по `Map`). Tombstone-записи (`isTombstone: true`) исключаются из результата. Результат сортируется по `offset`.
4. Реализовать состояния: `compacted: boolean`, `selectedKey: string | null`, `addKey: string`, `addValue: string`, `records: KafkaRecord[]`.
5. Реализовать функцию `handleAddRecord`: создаёт новую запись с `offset = max(offset) + 1`, `timestamp` — текущее время, `isTombstone = !addValue` (пустое значение = tombstone).
6. Реализовать функцию `handleDeleteKey(key)`: добавляет tombstone-запись для указанного ключа с `value: null`.
7. Переменная `currentRecords`: если `compacted === true` — применяет `runCompaction(records)`, иначе — оригинальный массив.
8. В режиме "до compaction" визуально выделять:
   - Дублированные устаревшие записи — тусклым фоном (жёлтый оттенок, opacity снижена)
   - Tombstone-записи — красным фоном и текстом `TOMBSTONE (null)`
9. Кнопка переключения: "Запустить Compaction" / "Показать всё". При compacted — отображать количество записей "после".
10. Форма добавления записи: поля `key` и `value` (если `value` пустой — создаётся tombstone).
11. Список существующих ключей с кнопкой "Delete" для каждого — добавляет tombstone.
12. Легенда цветов: жёлтый — дублированная запись, красный — tombstone, синий (после compaction) — актуальная запись.
13. Информационный блок: объяснение как работает Log Compaction и для каких use cases применяется.

## Чеклист

- [ ] Интерфейс `KafkaRecord` содержит все 5 полей включая опциональный `isTombstone`
- [ ] Массив `INITIAL_RECORDS` содержит 9 записей с повторяющимися ключами и tombstone для `user:3`
- [ ] `runCompaction` возвращает только последние записи по каждому ключу без tombstone-ов
- [ ] `handleAddRecord` корректно создаёт обычную запись и tombstone (при пустом value)
- [ ] `handleDeleteKey` добавляет tombstone с `value: null`
- [ ] Кнопка compaction переключает режим отображения
- [ ] В режиме "до compaction" дубликаты визуально приглушены
- [ ] Tombstone-записи отображаются красным и содержат текст `TOMBSTONE (null)`
- [ ] После compaction показываются только актуальные записи (без tombstone, без дубликатов)
- [ ] Форма добавления записи работает для обычных записей и tombstone
- [ ] Кнопки "Delete" для каждого ключа добавляют tombstone
- [ ] Легенда цветов присутствует
- [ ] Кнопка "Сброс" возвращает массив к `INITIAL_RECORDS`

## Как проверить себя

1. В начальном состоянии (до compaction) должно быть 9 записей. Записи `user:1` с offset 0 и 2 должны быть визуально приглушены — они устаревшие.
2. Нажмите "Запустить Compaction" — должно остаться 3 записи: последняя версия `user:1` (Sochi), `user:2` (Krasnodar), `user:4`. Запись `user:3` исчезает (tombstone = удаление).
3. Вернитесь в режим "до compaction". Добавьте запись с ключом `user:1` и значением `{"name":"Alice","city":"Vladivostok"}`. Нажмите "Запустить Compaction" — теперь `user:1` должен показывать Vladivostok.
4. Нажмите "Delete" у ключа `user:4` — появится tombstone-запись. Запустите Compaction — `user:4` исчезает.
5. В форме добавления оставьте поле Value пустым и добавьте запись — должен появиться tombstone с пометкой `TOMBSTONE (null)` красным цветом.
