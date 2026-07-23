# Задание 14.3 — Раскладываем legacy-модуль по слоям (сложное)

## Цель

Провести полноценную миграцию каталога товаров: распределить legacy-код по трём
разным слоям FSD и собрать из них законченный слайс сущности.

## Что дано

- `src/components/Avatar.tsx` — переиспользуемый примитив (🔒 только чтение).
- `src/utils/product.ts` — тип `Product` (🔒 только чтение).
- `src/api/productApi.ts` — запрос `fetchProduct` (🔒 только чтение).
- `src/shared/ui/Avatar.tsx`, `src/shared/ui/index.ts` — заглушки для примитива.
- `src/entities/product/model/types.ts`, `.../api/fetchProduct.ts`,
  `.../ui/ProductCard.tsx`, `.../index.ts` — заглушки для сущности.
- `src/widgets/product-list/ui/ProductList.tsx` — потребитель, сейчас собранный
  вручную из legacy-кусков.

## Требования

1. Перенесите `Avatar` в `shared/ui/Avatar.tsx`, реэкспортируйте его из
   `shared/ui/index.ts`.
2. Перенесите тип `Product` в `entities/product/model/types.ts`.
3. Перенесите `fetchProduct` в `entities/product/api/fetchProduct.ts`, тип `Product`
   берите из своего же слайса (`../model/types`).
4. Соберите `ProductCard` в `entities/product/ui/ProductCard.tsx`: `Avatar` — через
   public API `@/shared/ui`, `Product` — из своего слайса.
5. Заполните `entities/product/index.ts`, реэкспортировав `Product`, `fetchProduct`
   и `ProductCard`.
6. Переключите `ProductList.tsx` на импорт из `@/entities/product` и используйте
   готовый `ProductCard` вместо ручной вёрстки.
7. Нажмите «Проверить».

## Чеклист

- [ ] `shared/ui/Avatar.tsx` содержит перенесённый примитив, `shared/ui/index.ts`
      его реэкспортирует
- [ ] `entities/product/model/types.ts` содержит интерфейс `Product`
- [ ] `entities/product/api/fetchProduct.ts` содержит перенесённый запрос
- [ ] `entities/product/ui/ProductCard.tsx` берёт `Avatar` через public API `shared`
- [ ] `entities/product/index.ts` реэкспортирует `Product`, `fetchProduct`,
      `ProductCard`
- [ ] `ProductList.tsx` импортирует всё из `@/entities/product`
- [ ] Пройти квиз уровня ≥ 80%
