# Задание 11.2 — Двусторонний @x-контракт (среднее)

## Цель

Оформить @x-контракты в обе стороны между двумя сущностями и подключить обоих
потребителей.

## Что дано

- `entities/user` и `entities/product` — каждая знает только про себя.
- `ProductCard.tsx` должен показывать короткое имя продавца.
- `FavoriteProductBadge.tsx` должен показывать название избранного товара.

## Требования

1. В `entities/user/@x/product.ts` реэкспортируйте `User` как `UserPreview` —
   контракт «user отдаёт `product`».
2. В `entities/product/@x/user.ts` реэкспортируйте `Product` как
   `ProductPreview` — контракт «product отдаёт `user`».
3. В `ProductCard.tsx` импортируйте `UserPreview` из
   `@/entities/user/@x/product` и добавьте проп `seller`.
4. В `FavoriteProductBadge.tsx` импортируйте `ProductPreview` из
   `@/entities/product/@x/user` и добавьте проп `favorite`.
5. Нажмите «Проверить».

## Чеклист

- [ ] `entities/user/@x/product.ts` реэкспортирует `UserPreview`
- [ ] `entities/product/@x/user.ts` реэкспортирует `ProductPreview`
- [ ] `ProductCard.tsx` импортирует тип через `@/entities/user/@x/product`
- [ ] `FavoriteProductBadge.tsx` импортирует тип через
      `@/entities/product/@x/user`
- [ ] Пройти квиз уровня ≥ 80%
