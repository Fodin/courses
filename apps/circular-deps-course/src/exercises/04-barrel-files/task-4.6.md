# Задание 4.6 — Вложенные barrel и распутывание графа (сложное)

## Цель

Распутать граф зависимостей с вложенными barrel'ами, где сразу несколько ошибок в разных файлах вместе создают цикл, и почини всё, не трогая верхний публичный API.

## Что дано

- `src/widgets/shared.ts` — общая утилита `formatCount` (только для чтения).
- `src/widgets/index.ts` — верхний barrel, реэкспортирует саб-пакеты `cart` и `wishlist` и `formatCount` (только для чтения).
- `src/widgets/cart/index.ts` — barrel саб-пакета `cart`, реэкспортирует `CartWidget`, но заодно зачем-то реэкспортирует ещё и `WishlistWidget` из соседнего барrel `../wishlist`.
- `src/widgets/cart/component.ts` — берёт `formatCount` через верхний barrel `../../widgets` вместо `../shared`.
- `src/widgets/wishlist/index.ts` — barrel саб-пакета `wishlist`, реэкспортирует `WishlistWidget` (только для чтения).
- `src/widgets/wishlist/component.ts` — та же ошибка: берёт `formatCount` через верхний barrel `../../widgets`.

Три проблемы вместе замыкают граф в циклы:
- `widgets/index → cart/index → cart/component → widgets/index`;
- `widgets/index → wishlist/index → wishlist/component → widgets/index`;
- `cart/index → wishlist/index → wishlist/component → widgets/index → cart/index` (через лишний реэкспорт в `cart/index.ts`).

## Требования

1. В `cart/component.ts` замени импорт `formatCount` на прямой путь `../shared`.
2. В `wishlist/component.ts` сделай то же самое.
3. В `cart/index.ts` убери реэкспорт `WishlistWidget` из `../wishlist` — саб-пакет `cart` не должен зависеть от `wishlist`, `cart/index.ts` реэкспортирует только `CartWidget`.
4. `widgets/shared.ts`, `widgets/index.ts` и `wishlist/index.ts` не трогай — верхний публичный API остаётся прежним.
5. После правок в графе зависимостей не должно быть циклов.

## Чеклист

- [ ] `cart/component.ts` импортирует `formatCount` из `'../shared'`
- [ ] `wishlist/component.ts` импортирует `formatCount` из `'../shared'`
- [ ] `cart/index.ts` больше не реэкспортирует ничего из `../wishlist`
- [ ] `widgets/index.ts`, `widgets/shared.ts`, `wishlist/index.ts` не изменены
- [ ] Циклов в графе не осталось
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Изменить нужно ровно три файла: `cart/component.ts`, `wishlist/component.ts` и `cart/index.ts`. Все четыре проверки в лаборатории (`noRuntimeCycles` и три `fileContains`) должны стать зелёными, а верхний `widgets/index.ts` остаётся точно таким же, как в старте.
