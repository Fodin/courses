# Задание 5.1 — Фича как сценарий: add-to-cart (простое)

## Цель

Оформить фичу как пользовательский сценарий, который собирает сущность и
переиспользуемый UI, — и закрыть её public API.

## Что дано

- `entities/cart` — сущность корзины с готовым public API.
- `shared/ui` — переиспользуемая кнопка с готовым public API.
- `features/add-to-cart/ui/AddToCartButton.tsx` — кнопка «В корзину», которая лезет
  вглубь обоих слайсов мимо их `index.ts`.
- `features/add-to-cart/index.ts` — пустой public API самой фичи.

## Требования

1. В `AddToCartButton.tsx` замените импорт `@/entities/cart/model/store` на импорт
   через public API `@/entities/cart`.
2. Замените импорт `@/shared/ui/Button` на импорт через public API `@/shared/ui`.
3. В `features/add-to-cart/index.ts` реэкспортируйте `AddToCartButton` из
   `./ui/AddToCartButton`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `AddToCartButton` берёт `cartStore` через `@/entities/cart`
- [ ] `AddToCartButton` берёт `Button` через `@/shared/ui`
- [ ] `features/add-to-cart/index.ts` экспортирует `AddToCartButton`
- [ ] Пройти квиз уровня ≥ 80%
