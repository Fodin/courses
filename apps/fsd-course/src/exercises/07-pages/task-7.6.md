# Задание 7.6 — Разгрузка «толстой» страницы (сложное)

## Цель

Распределить логику и запросы «толстой» страницы по entities/features,
оставив саму страницу тонкой композицией.

## Что дано

- `entities/order/model/types.ts` — тип `Order` (только чтение).
- `entities/order/api/getOrder.ts` — заготовка с `TODO`.
- `entities/order/lib/formatOrderTotal.ts` — заготовка с `TODO`.
- `entities/order/index.ts` — заготовка public API сущности.
- `features/submit-order` — уже готовая фича отправки заказа, реэкспортирует
  `submitOrder` (только чтение).
- `pages/order/ui/OrderPage.tsx` — толстая страница: сама грузит заказ по
  сети, сама считает сумму, сама шлёт запрос на подтверждение.

## Требования

1. В `entities/order/api/getOrder.ts` реализуйте запрос заказа по `orderId`.
2. В `entities/order/lib/formatOrderTotal.ts` реализуйте подсчёт суммы
   (`price * qty` по всем `items`).
3. В `entities/order/index.ts` соберите полный public API: `Order`,
   `getOrder`, `formatOrderTotal`.
4. В `OrderPage.tsx` уберите прямые `fetch` и локальную функцию подсчёта —
   используйте `getOrder`/`formatOrderTotal` из `@/entities/order` и
   `submitOrder` из `@/features/submit-order`.
5. В `pages/order/index.ts` реэкспортируйте `OrderPage`.
6. Нажмите «Проверить».

## Чеклист

- [ ] `getOrder` и `formatOrderTotal` реализованы в `entities/order`
- [ ] Public API `entities/order` отдаёт `Order`, `getOrder`, `formatOrderTotal`
- [ ] В `OrderPage.tsx` нет прямых `fetch` и локального подсчёта суммы
- [ ] Отправка заказа идёт через `submitOrder` из `features/submit-order`
- [ ] У `pages/order` есть `index.ts`, реэкспортирующий `OrderPage`
- [ ] Пройти квиз уровня ≥ 80%
