# Задание 7.2 — Композиция без глубоких импортов (среднее)

## Цель

Собрать страницу из виджета и фичи строго через их public API.

## Что дано

- `widgets/product-card` — виджет с public API (`ProductCard`).
- `features/add-to-cart` — фича с public API (`AddToCartButton`).
- `pages/product/ui/ProductPage.tsx` — импортирует оба глубокими путями,
  мимо `index.ts`.

## Требования

1. В `ProductPage.tsx` замените импорт `ProductCard` на импорт из
   `@/widgets/product-card` (без `/ui/ProductCard`).
2. Замените импорт `AddToCartButton` на импорт из `@/features/add-to-cart`
   (без `/ui/AddToCartButton`).
3. В `pages/product/index.ts` реэкспортируйте `ProductPage`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `ProductPage.tsx` импортирует `ProductCard` из `@/widgets/product-card`
- [ ] `ProductPage.tsx` импортирует `AddToCartButton` из `@/features/add-to-cart`
- [ ] У `pages/product` есть `index.ts`, реэкспортирующий `ProductPage`
- [ ] Пройти квиз уровня ≥ 80%
