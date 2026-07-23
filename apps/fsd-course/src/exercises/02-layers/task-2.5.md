# Задание 2.5 — Виджет тянет страницу (среднее)

## Цель

Опустить композицию вниз: виджет не должен запрашивать данные у страницы,
страница должна передавать их виджету пропом.

## Что дано

- `widgets/order-summary/ui/OrderSummary.tsx` импортирует `getCurrentUser` из
  `@/pages/checkout`.
- `pages/checkout/ui/CheckoutPage.tsx` объявляет `getCurrentUser` и рендерит
  `<OrderSummary total={2500} />` без пользователя.

## Требования

1. В `OrderSummary.tsx` уберите импорт `pages/checkout`; добавьте компоненту
   проп `user: User` и используйте его вместо вызова `getCurrentUser`.
2. В `CheckoutPage.tsx` уберите функцию `getCurrentUser` (она больше не нужна)
   и передайте `<OrderSummary total={2500} user={demoUser} />`.
3. Нажмите «Проверить».

## Чеклист

- [ ] `OrderSummary.tsx` не импортирует `pages`
- [ ] `OrderSummary` принимает `user: User` пропом
- [ ] `CheckoutPage` передаёт `user={demoUser}` в `OrderSummary`
- [ ] Пройти квиз уровня ≥ 80%
