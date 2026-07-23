# Задание 12.6 — Распутать граф из четырёх пакетов (сложное)

## Цель

Распутать граф из четырёх пакетов монорепозитория: найти единственный настоящий цикл среди нескольких похожих связей и устранить его выделением общего слоя.

## Что дано

- `packages/catalog/src/index.ts` — пакет `@repo/catalog`. Определяет `formatMoney`, вызывает `computeDiscount` из `@repo/pricing`.
- `packages/pricing/src/index.ts` — пакет `@repo/pricing`. Определяет `computeDiscount`, вызывает `formatMoney` обратно из `@repo/catalog` (это и есть цикл `catalog ↔ pricing`) и вызывает `addToCart` из `@repo/cart` (легитимно).
- `packages/cart/src/index.ts` — пакет `@repo/cart`. Определяет `addToCart`, вызывает `formatMoney` из `@repo/catalog`.
- `packages/shared/src/index.ts` — заготовка нового пакета `@repo/shared` (пока `// TODO`).

## Требования

1. Перенесите `formatMoney` из `packages/catalog/src/index.ts` в `packages/shared/src/index.ts`.
2. В `packages/catalog/src/index.ts` импортируйте `formatMoney` из `@repo/shared` вместо локального определения; связь `catalog → pricing` (`computeDiscount`) оставьте как есть.
3. В `packages/pricing/src/index.ts` замените `import { formatMoney } from '@repo/catalog'` на импорт из `@repo/shared`; связь `pricing → cart` (`addToCart`) оставьте как есть.
4. В `packages/cart/src/index.ts` замените `import { formatMoney } from '@repo/catalog'` на импорт из `@repo/shared`.
5. Убедитесь, что `@repo/catalog` больше не является источником `formatMoney` ни для кого — эта роль полностью перешла к `@repo/shared`.
6. Нажмите «Проверить» — цикл `catalog ↔ pricing` должен исчезнуть, а весь граф — стать однонаправленным: `catalog → pricing → cart`, все три пакета → `shared`.

## Чеклист

- [ ] `packages/shared/src/index.ts` определяет `formatMoney`
- [ ] `@repo/catalog` берёт `formatMoney` из `@repo/shared`
- [ ] `@repo/pricing` берёт `formatMoney` из `@repo/shared`
- [ ] `@repo/cart` берёт `formatMoney` из `@repo/shared`
- [ ] В графе рантайм-импортов нет цикла
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Прежде чем редактировать файлы, нарисуйте граф связей на бумаге: `catalog → pricing`, `pricing → catalog`, `pricing → cart`, `cart → catalog`. Только одна пара рёбер (`catalog → pricing` и `pricing → catalog`) образует цикл — остальные связи легитимны и после рефакторинга остаются нетронутыми, меняется только источник `formatMoney`.
