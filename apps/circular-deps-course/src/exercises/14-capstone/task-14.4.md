# Задание 14.4 — FSD-срез без циклов: направление слоёв (простое)

## Цель

Починить вертикальный FSD-срез `entities → features → widgets`, где сущность нарушила направление и вызвала цикл.

## Что дано

- `entities/product/model/store.ts` — `getProduct` (🔒 только чтение).
- `entities/product/index.ts` — public API сущности; зачем-то импортирует `addToCart` из `features/add-to-cart` и логирует его тип.
- `features/add-to-cart/model/store.ts` и `index.ts` — фича легально импортирует сущность (🔒 только чтение).
- `widgets/product-card/index.ts` — виджет легально импортирует и сущность, и фичу (🔒 только чтение).

## Требования

1. Определите диагноз: `entities/product/index.ts` импортирует из `features/add-to-cart` — это импорт «вверх» по слоям (entities не должен знать про features), и именно он замыкает цикл, поскольку `features/add-to-cart` уже легально импортирует `entities/product`.
2. Удалите из `entities/product/index.ts` импорт `addToCart` и строку, которая его использует.
3. Оставьте только реэкспорты `getProduct` и `Product`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `entities/product/index.ts` не импортирует ничего из `features/*`
- [ ] Проверка `noRuntimeCycles()` — зелёная
- [ ] Проверка `importsRespectLayers()` — зелёная
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Направление FSD — сверху вниз: `app → pages → widgets → features → entities → shared`. Любой импорт «снизу вверх» (entities импортирует features) — уже сам по себе архитектурная ошибка, независимо от того, создаёт он цикл или нет.
