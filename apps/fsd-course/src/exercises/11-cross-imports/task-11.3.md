# Задание 11.3 — Глубокий cross-import → @x с обеих сторон (сложное)

## Цель

Навести порядок: заменить нарушение (глубокий cross-import в обе стороны)
корректным @x-контрактом.

## Что дано

- `entities/user/model/types.ts` импортирует `Product` напрямую из
  `@/entities/product/model/types` (глубокий импорт, мимо public API).
- `entities/product/model/types.ts` импортирует `User` напрямую из
  `@/entities/user/model/types` (тоже глубокий импорт).
- Заготовки `entities/user/@x/product.ts` и `entities/product/@x/user.ts` пусты.

## Требования

1. В `entities/user/@x/product.ts` реэкспортируйте `User` как `UserPreview`.
2. В `entities/product/@x/user.ts` реэкспортируйте `Product` как
   `ProductPreview`.
3. В `entities/user/model/types.ts` замените глубокий импорт на импорт
   `ProductPreview` из `@/entities/product/@x/user`.
4. В `entities/product/model/types.ts` замените глубокий импорт на импорт
   `UserPreview` из `@/entities/user/@x/product`.
5. Нажмите «Проверить».

## Чеклист

- [ ] `entities/user/@x/product.ts` реэкспортирует `UserPreview`
- [ ] `entities/product/@x/user.ts` реэкспортирует `ProductPreview`
- [ ] `entities/user/model/types.ts` больше не импортирует
      `entities/product/model/types` напрямую
- [ ] `entities/product/model/types.ts` больше не импортирует
      `entities/user/model/types` напрямую
- [ ] Пройти квиз уровня ≥ 80%
