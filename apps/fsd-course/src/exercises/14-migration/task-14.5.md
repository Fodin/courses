# Задание 14.5 — Собираем виджет из мигрированных кусков (среднее)

## Цель

Показать, что миграция — это не только перенос кода, но и правильная сборка. Слайс
`entities/product` и фича `features/add-to-cart` уже мигрированы, но виджет,
который их использует, обходит их public API.

## Что дано

- `entities/product` — готовый слайс с `Product`, `ProductCard`, public API (🔒
  только чтение).
- `features/add-to-cart` — готовый слайс с `AddToCartButton`, public API (🔒 только
  чтение).
- `src/widgets/product-card-widget/ui/ProductCardWidget.tsx` — виджет, тянущий
  внутренние сегменты сущности и фичи напрямую.
- `src/widgets/product-card-widget/index.ts` — пустой public API виджета.

## Требования

1. Замените импорты `ProductCard` и `Product` в виджете на импорт из public API
   `@/entities/product`.
2. Замените импорт `AddToCartButton` на импорт из public API `@/features/add-to-cart`.
3. Заполните `widgets/product-card-widget/index.ts`, реэкспортировав
   `ProductCardWidget`.
4. Нажмите «Проверить».

## Чеклист

- [ ] Виджет импортирует `Product` и `ProductCard` из `@/entities/product`
- [ ] Виджет импортирует `AddToCartButton` из `@/features/add-to-cart`
- [ ] `widgets/product-card-widget/index.ts` реэкспортирует `ProductCardWidget`
- [ ] Пройти квиз уровня ≥ 80%
