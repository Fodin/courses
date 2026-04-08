# Задание 9.3: Offset Management

## Цель

Реализовать интерактивный симулятор управления offset-ами в Kafka. Студент на практике увидит разницу между current offset и committed offset, поймёт понятия consumer lag и gap, и воочию наблюдает, что происходит с необработанными сообщениями при краше consumer.

## Требования

1. Определить интерфейс `PartitionOffsets` с полями: `id: number`, `logEndOffset: number`, `currentOffset: number`, `committedOffset: number`.
2. Начальное состояние: 3 партиции с разными значениями смещений (например, P0: log=20, current=15, committed=12; P1: log=18, current=18, committed=18; P2: log=25, current=22, committed=20).
3. Реализовать функцию `produce(partitionId)`: увеличивает `logEndOffset` на 1 для указанной партиции. Добавляет запись в лог.
4. Реализовать функцию `consume(partitionId)`: увеличивает `currentOffset` на 1 только если `currentOffset < logEndOffset`. Добавляет запись в лог.
5. Реализовать функцию `commit(partitionId)`: устанавливает `committedOffset = currentOffset`. Добавляет запись в лог с пометкой "→ __consumer_offsets".
6. Реализовать функцию `commitAll()`: для всех партиций устанавливает `committedOffset = currentOffset`. Добавляет запись в лог.
7. Реализовать функцию `crash()`:
   - устанавливает `crashed = true`
   - добавляет в лог "[CRASH] Consumer упал! current offset потерян..."
   - через 1500ms сбрасывает `currentOffset = committedOffset` для всех партиций (имитация перезапуска с committed offset)
   - добавляет "[RESTART] Consumer перезапущен — читает с committed offset"
   - снимает `crashed = false`
8. Отображать легенду с пояснением четырёх цветов: current offset (синий), committed offset (зелёный), log-end offset (оранжевый), gap (розовый).
9. Для каждой партиции отображать: прогресс-бар с тремя зонами (committed — зелёный, current>committed — розовый gap, оставшееся — тёмный), текстовое значение всех трёх offset-ов, вычисленные `lag = logEndOffset - currentOffset` и `gap = currentOffset - committedOffset`.
10. Кнопки для каждой партиции: Produce, Consume (disabled если currentOffset >= logEndOffset), Commit (disabled если уже закоммичено).
11. Кнопка "Crash consumer" заблокирована во время краша (показывает "Перезапуск...").
12. Отображать лог последних 15 событий с цветовой кодировкой: CRASH — розовый, RESTART — зелёный, Committed — синий, остальное — серый.

## Чеклист

- [ ] Интерфейс `PartitionOffsets` содержит все 4 поля
- [ ] Начальное состояние задаёт разные значения offset для 3 партиций
- [ ] `produce` увеличивает `logEndOffset` и пишет в лог
- [ ] `consume` увеличивает `currentOffset` только при наличии новых сообщений
- [ ] `commit` сохраняет `currentOffset` как `committedOffset` и пишет в лог
- [ ] `commitAll` коммитит все партиции одним действием
- [ ] `crash` сбрасывает `currentOffset` к `committedOffset` через 1500ms
- [ ] Во время краша все кнопки заблокированы
- [ ] Прогресс-бар показывает три зоны: committed, gap, lag
- [ ] `lag` и `gap` вычисляются и отображаются для каждой партиции
- [ ] Кнопка Commit заблокирована если committedOffset === currentOffset
- [ ] Лог событий с цветовой кодировкой по типу

## Как проверить себя

1. Нажмите "Consume" несколько раз для P0, затем "Crash consumer". Убедитесь, что через 1.5 секунды `currentOffset` вернулся к значению `committedOffset` — это gap будет прочитан заново.
2. Нажмите "Commit" для P0, затем "Crash consumer". Теперь gap = 0, сообщения не будут перечитаны — at-least-once vs at-most-once.
3. Нажмите "Produce" для любой партиции — `logEndOffset` должен вырасти на 1, `lag` увеличится.
4. Нажмите "Consume" до конца (кнопка заблокируется) — `lag` должен стать 0.
5. Нажмите "Закоммитить все" — gap у всех партиций должен стать 0, кнопки Commit заблокируются.
6. Проверьте прогресс-бар: зелёная зона = committed, розовая = gap, тёмная = lag.
