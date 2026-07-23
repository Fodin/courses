# Задание 7.3 — Страница из нескольких виджетов и фич (сложное)

## Цель

Навести порядок в импортах страницы, которая собирает сразу несколько
виджетов и фич, и закрыть её собственным public API.

## Что дано

- `widgets/order-summary` — виджет с public API (`OrderSummary`).
- `features/checkout-form` — фича с public API (`CheckoutForm`).
- `features/apply-promo` — фича с public API (`PromoForm`).
- `pages/checkout/ui/CheckoutPage.tsx` — импортирует все три глубокими
  путями, мимо `index.ts` каждого.

## Требования

1. Переведите все три импорта в `CheckoutPage.tsx` на public API
   соответствующих виджета/фич (`@/widgets/order-summary`,
   `@/features/checkout-form`, `@/features/apply-promo`).
2. В `pages/checkout/index.ts` соберите публичный интерфейс страницы —
   реэкспортируйте `CheckoutPage`.
3. Нажмите «Проверить».

## Чеклист

- [ ] Нет ни одного глубокого импорта в `CheckoutPage.tsx`
- [ ] Все три импорта идут через public API виджета/фич
- [ ] У `pages/checkout` есть `index.ts`, реэкспортирующий `CheckoutPage`
- [ ] Пройти квиз уровня ≥ 80%
