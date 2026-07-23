# Задание 12.2 — Глубокий импорт мимо public API (среднее)

## Цель

Завести public API сущности и убрать глубокий импорт в обход него.

## Что дано

- `entities/product/index.ts` не заполнен — public API сущности пуст.
- `widgets/product-card/ui/describe-product.ts` импортирует тип `Product` напрямую
  из `entities/product/model/types.ts`, минуя `index.ts`.

## Требования

1. В `entities/product/index.ts` реэкспортируйте тип `Product` из `./model/types`.
2. В `widgets/product-card/ui/describe-product.ts` замените импорт на
   `@/entities/product` (без хвоста `/model/types`).
3. Нажмите «Проверить».

## Чеклист

- [ ] `entities/product/index.ts` экспортирует `Product`
- [ ] Виджет импортирует `Product` из `@/entities/product`
- [ ] Нет глубокого импорта во внутренний сегмент чужого слайса
- [ ] Пройти квиз уровня ≥ 80%
