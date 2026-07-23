# Задание 15.3 — Несколько антипаттернов в модуле (сложное)

## Цель

Найти и исправить сразу букет антипаттернов в одном модуле, приведя его к чистой
FSD-структуре.

## Что дано

`features/add-to-cart/index.ts` одновременно:

1. Содержит бизнес-логику (`handleAddToCart`) прямо в барреле вместо `model/`.
2. Импортирует соседнюю фичу `features/wishlist` — cross-import того же слоя.
3. Импортирует `entities/cart/model/store` глубоким импортом в обход public API.
4. Делает `export * from './ui'`, бесконтрольно вытаскивая наружу всё содержимое
   сегмента.

## Требования

1. Перенесите `handleAddToCart` в `features/add-to-cart/model/addToCart.ts`.
2. Уберите зависимость от `features/wishlist` — фичи одного слоя не должны знать друг
   о друге; если нужна такая композиция, её место в виджете, не в фиче.
3. Импортируйте `entities/cart` только через его public API (`@/entities/cart`), без
   глубокого пути в `model/store`.
4. Сделайте `index.ts` тонким: только именованные реэкспорты `handleAddToCart` и
   `AddToCartButton`, без `export *`.
5. Нажмите «Проверить».

## Чеклист

- [ ] `index.ts` не содержит бизнес-логики, только реэкспорты
- [ ] `index.ts` не упоминает `wishlist`
- [ ] `index.ts` не содержит `export *`
- [ ] Импорт `entities/cart` идёт через public API
- [ ] `model/addToCart.ts` вызывает `addItem` из `@/entities/cart`
- [ ] Пройти квиз уровня ≥ 80%
