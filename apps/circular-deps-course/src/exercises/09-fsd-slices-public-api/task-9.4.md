# Задание 9.4 — Глубокий импорт мимо public API (простое)

## Цель

Увидеть базовое нарушение public API — импорт вглубь чужого слайса — и научиться его чинить.

## Что дано

- `entities/product/model/price.ts` — `calcPrice` (🔒 только чтение).
- `entities/product/index.ts` — public API слайса, уже реэкспортирует `calcPrice` (🔒 только чтение).
- `features/cart/model/total.ts` — `getCartTotal` импортирует `calcPrice` напрямую из `entities/product/model/price`, в обход `index.ts`.

## Требования

1. Замените импорт `calcPrice` в `features/cart/model/total.ts`: вместо `'entities/product/model/price'` используйте `'@/entities/product'`.
2. Логика `getCartTotal` не меняется — меняется только источник импорта.
3. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `calcPrice` импортируется из `@/entities/product`, а не из внутреннего сегмента
- [ ] Проверка `noDeepImport` — зелёная
- [ ] Проверка `noRuntimeCycles` — зелёная
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Даже если сейчас такой импорт «безопасен» и не создаёт цикла, он делает внутреннюю структуру `entities/product` частью публичного контракта: `entities/product` больше не может свободно переместить `price.ts`, не сломав `features/cart`.
