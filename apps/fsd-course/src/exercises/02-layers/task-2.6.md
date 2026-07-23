# Задание 2.6 — Однонаправленная цепочка из пяти слоёв (сложное)

## Цель

Собрать корректную цепочку `pages → widgets → features → entities → shared` из
кусков фичи «лайк товара», которые сейчас разложены не по слоям.

## Что дано

- `entities/product/index.ts` — пустой (нет public API).
- `features/like-button/index.ts` — пустой (нет public API).
- `features/like-button/ui/LikeButton.tsx` импортирует `Icon` из
  `@/widgets/product-card/ui/Icon` — дубликат иконки, ошибочно оказавшийся в
  widgets, да ещё и глубоким импортом.
- `widgets/product-card/ui/ProductCard.tsx` импортирует `getFeaturedProduct` из
  `@/pages/catalog` вместо приёма товара пропом.
- `shared/ui/Icon.tsx` — настоящая, корректно расположенная иконка.

## Требования

1. Реэкспортируйте `Product` из `entities/product/index.ts`.
2. Реэкспортируйте `LikeButton` из `features/like-button/index.ts`.
3. В `LikeButton.tsx` замените импорт иконки на `import { Icon } from '@/shared/ui'`.
4. В `ProductCard.tsx` уберите импорт `pages/catalog`; добавьте компоненту проп
   `product: Product` и используйте его вместо вызова `getFeaturedProduct`.
5. В `CatalogPage.tsx` уберите функцию `getFeaturedProduct` и передайте
   `<ProductCard product={demoProduct} />`.
6. Нажмите «Проверить».

## Чеклист

- [ ] `entities/product/index.ts` экспортирует `Product`
- [ ] `features/like-button/index.ts` экспортирует `LikeButton`
- [ ] `LikeButton.tsx` берёт `Icon` из `@/shared/ui`, а не из `widgets`
- [ ] `ProductCard` принимает `product: Product` пропом
- [ ] `CatalogPage` передаёт `product={demoProduct}` в `ProductCard`
- [ ] Пройти квиз уровня ≥ 80%
