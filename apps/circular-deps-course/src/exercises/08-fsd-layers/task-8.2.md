# Задание 8.2 — Цепочка через три слоя, замкнутая импортом вверх (среднее)

## Цель

Распутать цикл, который проходит через три слоя подряд: `widgets → features → entities`, и замыкается одним «обратным» импортом из `entities` в `widgets`.

## Что дано

- `src/widgets/header/ui/Header.tsx` (только для чтения) — экспортирует константу `HEADER_TITLE` и компонует `NotificationsBell` из `features`.
- `src/features/notifications-bell/ui/NotificationsBell.tsx` (только для чтения) — использует `getUnreadCount` из `entities/notification`.
- `src/entities/notification/model/notification.ts` (редактируется) — вместо самостоятельного вычисления импортирует `HEADER_TITLE` прямо из `widgets/header` — через два слоя «вверх».

Цепочка `widgets → features → entities` разрешена, но ребро `entities → widgets` её замыкает: `widgets → features → entities → widgets`.

## Требования

1. Не редактируйте `widgets/header/ui/Header.tsx` и `features/notifications-bell/ui/NotificationsBell.tsx` — они уже корректны.
2. Уберите импорт `HEADER_TITLE` из `entities/notification/model/notification.ts`.
3. `getUnreadCount` должна возвращать значение, не зависящее от вышестоящих слоёв.
4. После правки в проекте не должно быть рантайм-цикла импортов.
5. Все импорты должны идти строго «вниз» по иерархии слоёв.

## Чеклист

- [ ] `entities/notification/model/notification.ts` не импортирует ничего из `widgets`
- [ ] `getUnreadCount` работает независимо от `widgets/header`
- [ ] Проверка «нет рантайм-цикла» — зелёная
- [ ] Проверка «импорты уважают слои» — зелёная
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

1. Нажмите «Проверить» — обе проверки должны стать зелёными.
2. Проследите глазами всю цепочку `widgets → features → entities` в файлах — убедитесь, что обратного ребра больше нет.
3. Сравните с эталоном через «Показать эталон», если застряли.
