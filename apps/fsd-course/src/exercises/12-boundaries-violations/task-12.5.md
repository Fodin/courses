# Задание 12.5 — Домен в shared (среднее)

## Цель

Перенести доменную сущность из `shared` в `entities` и поправить импорты.

## Что дано

- `shared/lib/notification.ts` содержит доменный интерфейс `Notification` — а
  `shared` не должен знать про предметную область.
- `entities/notification/model/types.ts` и `entities/notification/index.ts` —
  заготовки для нового слайса.
- `features/inbox/model/inbox.ts` импортирует `Notification` напрямую из
  `shared/lib/notification`.

## Требования

1. Перенесите интерфейс `Notification` в `entities/notification/model/types.ts`.
2. В `entities/notification/index.ts` реэкспортируйте `Notification`.
3. В `shared/lib/notification.ts` уберите интерфейс — файл должен остаться пустым
   (можно оставить только комментарий).
4. В `features/inbox/model/inbox.ts` переключите импорт на `@/entities/notification`.
5. Нажмите «Проверить».

## Чеклист

- [ ] В `shared/lib/notification.ts` нет доменного интерфейса
- [ ] `entities/notification/index.ts` экспортирует `Notification`
- [ ] `features/inbox/model/inbox.ts` импортирует из `@/entities/notification`
- [ ] Пройти квиз уровня ≥ 80%
