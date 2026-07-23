# Задание 11.1 — Первый @x-контракт (простое)

## Цель

Завести первый управляемый cross-import через @x-нотацию.

## Что дано

- `entities/product/model/types.ts` — помимо `Product`, содержит узкую проекцию
  продавца `User` (только `id` и `displayName`). Этот тип не входит в обычный
  public API продукта — `index.ts` отдаёт только `Product`.
- `entities/user/ui/SellerBadge.tsx` — заготовка компонента, который должен
  показывать имя продавца, используя именно тип `User` из product.

## Требования

1. В `entities/product/@x/user.ts` реэкспортируйте тип `User` из
   `../model/types` — это и есть @x-контракт «product отдаёт `user`».
2. В `SellerBadge.tsx` импортируйте тип `User` из `@/entities/product/@x/user`
   (а не откуда-то ещё) и используйте его в пропсах.
3. Нажмите «Проверить».

## Чеклист

- [ ] Файл `entities/product/@x/user.ts` реэкспортирует тип `User`
- [ ] `SellerBadge.tsx` импортирует тип через `@/entities/product/@x/user`
- [ ] Пройти квиз уровня ≥ 80%
