# Задание 2.3 — Мини-граф из трёх слоёв (сложное)

## Цель

Привести граф `widgets/product-page → features/wishlist → entities/product` к
однонаправленному виду — сейчас в нём спрятаны два импорта вверх.

## Что дано

- `entities/product/model/stock.ts` импортирует `isWishlisted` из
  `@/features/wishlist` (сущность знает про features).
- `features/wishlist/model/toggle.ts` импортирует `currentProductId` из
  `@/widgets/product-page` (features знает про widgets).
- `widgets/product-page/ui/ProductPage.tsx` уже написан правильно — трогать не
  нужно.

## Требования

1. В `stock.ts` уберите импорт `features/wishlist`; `getAvailabilityLabel`
   должна определять доступность только по `product.stock`, без обращения к
   списку желаний.
2. В `toggle.ts` уберите импорт `widgets/product-page`; `toggleWishlist` должна
   принимать `productId: string` параметром.
3. Нажмите «Проверить».

## Чеклист

- [ ] `stock.ts` не импортирует `features`
- [ ] `getAvailabilityLabel(product: Product)` не знает про wishlist
- [ ] `toggle.ts` не импортирует `widgets`
- [ ] `toggleWishlist(productId: string)` — сигнатура именно такая
- [ ] Пройти квиз уровня ≥ 80%
