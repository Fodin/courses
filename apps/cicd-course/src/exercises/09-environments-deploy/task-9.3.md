# Задание 9.3: Rollback — симулятор отката деплоя

## Цель

Создать интерактивный симулятор истории деплоев с возможностью rollback. Визуализировать три тега образа: `sha`, `stable`, `previous` — и показать, как они меняются при каждом деплое и откате.

## Требования

1. Отобразить "реестр образов" — список из 5 образов с тегами SHA (например, `a1b2c3d`, `e4f5g6h`, ...)
2. Показать три специальных тега: `previous`, `stable`, `latest/sha` — на каком образе они сейчас указывают
3. Кнопка "Deploy new version" — симулирует деплой нового образа: `previous` ← старый `stable`, `stable` ← новый SHA
4. Кнопка "Rollback" — симулирует откат: `stable` ← `previous`, показать визуальный сигнал успеха
5. Показать "Production" — блок, который отображает текущий `stable`-тег и его SHA
6. Лог событий — список последних 6 действий (Deploy v4, Rollback to v3, Deploy v5, ...)
7. Кнопка "Simulate incident" — автоматически делает Deploy, потом предлагает Rollback с подсветкой проблемы

## Чеклист

- [ ] Список SHA-образов в виде таблицы или карточек
- [ ] Визуальные стрелки или бейджи показывают, какой тег (previous/stable) указывает на какой SHA
- [ ] Production-блок показывает текущий активный образ (stable)
- [ ] Кнопка Deploy обновляет теги previous и stable
- [ ] Кнопка Rollback меняет stable обратно на previous, previous становится недоступен (нет истории глубже 1)
- [ ] После двух Rollback подряд кнопка должна быть disabled (нет previous)
- [ ] Лог событий — последние 6 записей с временем
- [ ] Кнопка Simulate Incident — 2 автоматических шага с задержкой или пошагово

## Как проверить себя

1. Нажми Deploy три раза — убедись, что previous/stable корректно переключаются
2. Нажми Rollback — stable должен вернуться к предыдущему SHA
3. Нажми Rollback ещё раз — кнопка должна быть disabled (нет предыдущей версии для отката)
4. Нажми Simulate Incident — должен произойти деплой "плохой" версии, потом предложение rollback
5. Проверь лог — все действия должны быть записаны

## Подсказки

- Храни `images` (массив SHA строк), `stableIndex` (число), `previousIndex` (число | null)
- При Deploy: `previousIndex = stableIndex`, `stableIndex = stableIndex + 1` (циклично по массиву)
- При Rollback: `stableIndex = previousIndex`, `previousIndex = null`
- Disabled для Rollback: `previousIndex === null`
- Для Simulate Incident: установи `incident: true` в стейте, меняй стиль Production-блока
