# Задание 5.6 — Распутываем фичу с двойным нарушением (сложное)

## Цель

Устранить в одной фиче сразу два нарушения: импорт вверх по слоям и
cross-import соседней фичи.

## Что дано

- `features/order-review/model/summary.ts` — функция `getOrderSummary`, которая:
  - импортирует `PANEL_WIDTH` из `@/widgets/cart-panel` (импорт вверх);
  - импортирует `discount` из `@/features/loyalty-points` (cross-import соседней
    фичи), хотя такая же формула уже есть в `shared/lib` как `applyPromo`.
- `features/order-review/index.ts` — пустой public API фичи.

## Требования

1. Уберите импорт `@/widgets/cart-panel` — вопрос ширины панели решает виджет,
   а не фича; `getOrderSummary` больше не возвращает `width`.
2. Замените `discount` из `@/features/loyalty-points` на `applyPromo` из
   `@/shared/lib`.
3. В `features/order-review/index.ts` реэкспортируйте `getOrderSummary` из
   `./model/summary`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `summary.ts` не импортирует `widgets/cart-panel`
- [ ] `summary.ts` не импортирует `features/loyalty-points`
- [ ] `summary.ts` использует `applyPromo` из `@/shared/lib`
- [ ] `features/order-review/index.ts` экспортирует `getOrderSummary`
- [ ] Пройти квиз уровня ≥ 80%
