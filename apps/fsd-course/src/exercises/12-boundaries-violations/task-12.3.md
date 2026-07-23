# Задание 12.3 — Несколько нарушений сразу (сложное)

## Цель

Починить сразу два нарушения границ в одном модуле: импорт вверх и глубокий импорт.

## Что дано

- `features/checkout/model/checkout.ts` импортирует тип `Order` напрямую из
  `entities/order/model/types.ts` (глубокий импорт) и константу
  `CART_STORAGE_KEY` из `pages/cart/model/constants.ts` (импорт вверх).
- `entities/order/index.ts` не заполнен.

## Требования

1. В `entities/order/index.ts` реэкспортируйте тип `Order` из `./model/types`.
2. В `checkout.ts` импортируйте `Order` из `@/entities/order`.
3. Уберите импорт `CART_STORAGE_KEY` из `pages/cart` — объявите локальную константу
   `CHECKOUT_STORAGE_KEY` прямо в `checkout.ts`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `entities/order/index.ts` экспортирует `Order`
- [ ] `checkout.ts` импортирует `Order` только через `@/entities/order`
- [ ] `checkout.ts` не зависит от `pages/cart`
- [ ] Пройти квиз уровня ≥ 80%
