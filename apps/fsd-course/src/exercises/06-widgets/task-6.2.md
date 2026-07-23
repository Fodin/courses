# Задание 6.2 — Композиция через public API соседей (среднее)

## Цель

Перевести виджет `widgets/product-card` и его потребителя `pages/catalog` на
импорт соседей через public API, убрав глубокие импорты.

## Что дано

- `widgets/product-card/ui/ProductCard.tsx` (редактируемый) — тянет `Product`,
  `ProductPrice` из `entities/product` и `AddToCartButton` из `features/add-to-cart`
  напрямую, в обход их `index.ts`;
- `pages/catalog/ui/CatalogPage.tsx` (редактируемый) — тянет сам `ProductCard`
  в обход `index.ts` виджета;
- `entities/product`, `features/add-to-cart`, `widgets/product-card/index.ts`
  (только чтение) — уже корректны.

## Требования

1. В `ProductCard.tsx` замените импорты на `@/entities/product` и
   `@/features/add-to-cart`.
2. В `CatalogPage.tsx` замените импорт виджета на `@/widgets/product-card`.
3. Нажмите «Проверить».

## Чеклист

- [ ] `ProductCard.tsx` не импортирует внутренние сегменты соседей
- [ ] `CatalogPage.tsx` импортирует виджет через `@/widgets/product-card`
- [ ] Импорты уважают слои и public API
- [ ] Пройти квиз уровня ≥ 80%
