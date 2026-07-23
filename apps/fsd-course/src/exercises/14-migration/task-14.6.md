# Задание 14.6 — Финальный шаг: собираем экран (сложное)

## Цель

Завершить миграцию экрана: собрать `pages/catalog` из уже мигрированных сущности,
фичи и виджета — строго через их public API, без единого обходного импорта.

## Что дано

- `entities/product`, `features/add-to-cart`, `widgets/product-card-widget` — уже
  мигрированы и закрыты public API (🔒 только чтение).
- `src/pages/catalog/ui/CatalogPage.tsx` — страница, обходящая public API всех трёх
  слайсов (импортирует их внутренние сегменты напрямую).
- `src/pages/catalog/index.ts` — пустой public API страницы.

## Требования

1. Замените импорт `ProductCardWidget` на импорт из `@/widgets/product-card-widget`.
2. Замените импорт `AddToCartButton` на импорт из `@/features/add-to-cart`.
3. Замените импорт типа `Product` на импорт из `@/entities/product`.
4. Заполните `pages/catalog/index.ts`, реэкспортировав `CatalogPage`.
5. Нажмите «Проверить» — граф импортов должен идти строго вниз по слоям
   (`pages → widgets → features → entities`), без единого глубокого импорта.

## Чеклист

- [ ] Страница импортирует `ProductCardWidget` из `@/widgets/product-card-widget`
- [ ] Страница импортирует `AddToCartButton` из `@/features/add-to-cart`
- [ ] Страница импортирует `Product` из `@/entities/product`
- [ ] `pages/catalog/index.ts` реэкспортирует `CatalogPage`
- [ ] Пройти квиз уровня ≥ 80%
