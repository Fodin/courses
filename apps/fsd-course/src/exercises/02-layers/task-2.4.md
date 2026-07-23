# Задание 2.4 — Бизнес-код не место в shared (простое)

## Цель

Перенести компонент с бизнес-логикой из `shared` в `features` — правильный
слой для пользовательского сценария «добавить в корзину».

## Что дано

- `shared/ui/AddToCartButton.tsx` импортирует `cartStore` из `@/entities/cart`
  и вызывает `cartStore.add`. `shared` не должен знать про доменные сущности.
- `features/add-to-cart/ui/AddToCartButton.tsx` и
  `features/add-to-cart/index.ts` — пустые заготовки для переноса.

## Требования

1. Перенесите реализацию кнопки в `features/add-to-cart/ui/AddToCartButton.tsx`
   (импорт `@/entities/cart` там разрешён — features может опускаться вниз).
2. Реэкспортируйте `AddToCartButton` из `features/add-to-cart/index.ts`.
3. Очистите `shared/ui/AddToCartButton.tsx` от импорта `entities/cart` (оставьте
   пояснительный комментарий или удалите содержимое).
4. Нажмите «Проверить».

## Чеклист

- [ ] `shared/ui/AddToCartButton.tsx` не импортирует `entities`
- [ ] `features/add-to-cart/index.ts` экспортирует `AddToCartButton`
- [ ] `features/add-to-cart/ui/AddToCartButton.tsx` вызывает `cartStore.add`
- [ ] Пройти квиз уровня ≥ 80%
