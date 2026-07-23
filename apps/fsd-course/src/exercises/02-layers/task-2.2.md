# Задание 2.2 — Два импорта вверх (среднее)

## Цель

Развернуть сразу две зависимости `entities → выше` в одном слайсе.

## Что дано

- `entities/order/model/pricing.ts` импортирует `getPromoDiscount` из
  `@/features/promo-code`.
- `entities/order/model/notify.ts` импортирует `showOrderToast` из
  `@/widgets/order-toast`.

## Требования

1. В `pricing.ts` уберите импорт `features/promo-code`; добавьте `getFinalPrice`
   второй параметр `discount: number` и используйте его напрямую.
2. В `notify.ts` уберите импорт `widgets/order-toast` и вызов `showOrderToast` —
   `markOrderPaid` должна просто возвращать заказ со статусом `'paid'`.
3. Нажмите «Проверить».

## Чеклист

- [ ] `pricing.ts` не импортирует `features`
- [ ] `getFinalPrice(order: Order, discount: number)` — сигнатура именно такая
- [ ] `notify.ts` не импортирует `widgets`
- [ ] `markOrderPaid` возвращает заказ со `status: 'paid'`
- [ ] Пройти квиз уровня ≥ 80%
