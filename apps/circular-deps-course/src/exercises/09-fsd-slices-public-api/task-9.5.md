# Задание 9.5 — Несколько глубоких импортов, один замыкает цикл (среднее)

## Цель

Научиться отличать «безобидный», но неправильный глубокий импорт от глубокого импорта, который на самом деле замыкает цикл.

## Что дано

Три глубоких импорта мимо public API:

1. `entities/user/model/user.ts` хранит `lastOrder: Order`, импортируя `Order` напрямую из `entities/order/model/order.ts`.
2. `entities/order/model/order.ts` хранит `owner: User`, импортируя `User` напрямую из `entities/user/model/user.ts` — **эта пара и замыкает цикл**.
3. `features/dashboard/model/stats.ts` импортирует тип `Order` напрямую из `entities/order/model/order.ts` — нарушение public API, но в цикле не участвует.

## Требования

1. В `entities/user/model/user.ts` замените поле `lastOrder: Order` на `lastOrderId: string` и уберите импорт `Order`.
2. В `entities/order/model/order.ts` замените поле `owner: User` на `ownerId: string` и уберите импорт `User`.
3. В `features/dashboard/model/stats.ts` замените импорт `'entities/order/model/order'` на `'@/entities/order'` — сам код `describeOrder` не меняется.
4. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `User` хранит `lastOrderId: string`, импорт `Order` удалён
- [ ] `Order` хранит `ownerId: string`, импорт `User` удалён
- [ ] `features/dashboard/model/stats.ts` импортирует `Order` через `@/entities/order`
- [ ] Проверка `noDeepImport` — зелёная
- [ ] Проверка `noRuntimeCycles` — зелёная
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Сравните два «плеча» задания: `dashboard → order` — не участвует в цикле, её достаточно перевести на public API. А вот `user ⇄ order` — цикл, и одного переключения на public API там недостаточно: нужно убрать сам факт хранения вложенного объекта.
