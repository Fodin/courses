# Задание 9.4: Consumer Rebalancing

## Цель

Реализовать интерактивный симулятор стратегий Consumer Rebalancing. Студент визуально сравнит Eager и Cooperative Sticky подходы, поймёт разницу в количестве шагов, наличии stop-the-world паузы и влиянии на производительность системы.

## Требования

1. Определить тип `RebalanceStrategy` — union type: `'eager' | 'cooperative'`.
2. Определить интерфейс `RebalanceEvent` с полями: `time: number`, `label: string`, `type: 'join' | 'leave' | 'stop' | 'resume' | 'assign' | 'revoke' | 'sync'`, `consumer?: string`.
3. Реализовать функцию `buildEagerTimeline(action, consumerName)` — возвращает массив событий для Eager стратегии:
   - t=0: consumer join/leave
   - t=100: ВСЕ consumers останавливают потребление (stop-the-world)
   - t=200: Coordinator отзывает ВСЕ партиции (revoke all)
   - t=400: Group Leader вычисляет новое распределение (sync)
   - t=600: все consumers получают новые партиции (assign)
   - t=700: все consumers возобновляют потребление (resume)
4. Реализовать функцию `buildCooperativeTimeline(action, consumerName)` — возвращает массив для Cooperative Sticky:
   - При join (5 событий): подключение → Round 1 revoke только нужных партиций → остальные продолжают → Round 2 назначение новому → полная работа
   - При leave (5 событий): graceful shutdown → добровольная отдача партиций → Round 1 перераспределение без остановки → остальные не прерывались → завершение shutdown
5. Определить словарь цветов `EVENT_COLORS` для каждого типа события: join — зелёный, leave — розовый, stop — красный, resume — голубой, assign — зелёный, revoke — оранжевый, sync — фиолетовый.
6. Реализовать функцию `runSimulation()`:
   - выбирает имя consumer: при join — "consumer-4", при leave — "consumer-2"
   - строит timeline по текущей стратегии
   - устанавливает `playing = true`
   - раскрывает события по одному с интервалом 700ms через `setTimeout`
   - по завершении снимает `playing`
7. Отображать карточки выбора стратегии (2 колонки): описание, преимущества, пометка "Stop-the-world" для Eager и "Incremental" для Cooperative. Клик на карточку меняет стратегию и сбрасывает timeline.
8. Отображать кнопки выбора действия: "Consumer Join" и "Consumer Leave".
9. Кнопка "Запустить симуляцию" / "Симуляция..." (disabled во время анимации).
10. Отображать timeline как вертикальную дорожку с кружком-маркером (цвет по типу события) и карточкой события: тип заглавными буквами, метка, время t+Nms.
11. После завершения симуляции показывать итоговый блок: для Eager — красный фон с указанием времени паузы (~600-700ms), для Cooperative — зелёный фон с упоминанием CooperativeStickyAssignor (Kafka 2.4+).

## Чеклист

- [ ] Тип `RebalanceStrategy` объявлен как union type из 2 значений
- [ ] Интерфейс `RebalanceEvent` содержит все 4 поля включая опциональный `consumer`
- [ ] `buildEagerTimeline` возвращает 6 событий с временными метками 0-700
- [ ] `buildCooperativeTimeline` возвращает 5 событий для join и 5 для leave
- [ ] Словарь `EVENT_COLORS` содержит цвета для всех 7 типов событий
- [ ] `runSimulation` строит timeline, анимирует с интервалом 700ms
- [ ] Смена стратегии сбрасывает timeline и visibleCount
- [ ] Карточки стратегий содержат описание и пометки Stop-the-world / Incremental
- [ ] Кнопки Join/Leave переключают тип действия
- [ ] Кнопка симуляции заблокирована во время воспроизведения
- [ ] События раскрываются по одному с нужными цветами и временными метками
- [ ] Итоговый блок появляется после завершения с правильным цветом

## Как проверить себя

1. Выберите "Eager Rebalancing" и запустите симуляцию Consumer Join. Убедитесь, что шаг "ВСЕ consumers останавливают потребление" присутствует — это и есть stop-the-world.
2. Переключитесь на "Cooperative Sticky" с тем же действием. Найдите шаг "остальные consumers ПРОДОЛЖАЮТ работу" — именно это отличает incremental rebalancing.
3. Проверьте сценарий Leave для обеих стратегий. В Cooperative должен быть шаг "graceful shutdown" — он возможен только при корректном завершении процесса.
4. Подсчитайте шаги: Eager — 6, Cooperative — 5. Cooperative требует 2 round-trip, но без полной паузы.
5. Дождитесь итогового блока: для Eager — красный с временем паузы, для Cooperative — зелёный с рекомендацией.
6. Повторно запустите симуляцию — анимация должна начаться сначала.
