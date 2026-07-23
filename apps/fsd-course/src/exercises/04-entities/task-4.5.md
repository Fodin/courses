# Задание 4.5 — Взаимные ссылки сущностей (среднее)

## Цель

Развязать две сущности, которые ссылаются друг на друга объектами целиком.

## Что дано

- `entities/room/model/types.ts` — `Room` с полем `currentBooking: Booking | null`
  (импорт `booking`);
- `entities/booking/model/types.ts` — `Booking` с полем `room: Room` (импорт `room`).

Обе сущности одного слоя импортируют друг друга — cross-import в обе стороны.

## Требования

1. В `room/model/types.ts` уберите импорт `booking` и замените
   `currentBooking: Booking | null` на `currentBookingId: string | null`.
2. В `booking/model/types.ts` уберите импорт `room` и замените `room: Room` на
   `roomId: string`.
3. Нажмите «Проверить».

## Чеклист

- [ ] Ни один из файлов не импортирует соседний слайс
- [ ] `Room` ссылается на бронь по `currentBookingId`
- [ ] `Booking` ссылается на номер по `roomId`
- [ ] Пройти квиз уровня ≥ 80%
