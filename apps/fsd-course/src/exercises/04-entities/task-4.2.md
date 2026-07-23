# Задание 4.2 — Новый сегмент и его public API (среднее)

## Цель

Довести до public API новый сегмент сущности и перевести потребителя на него.

## Что дано

- `entities/product` с сегментами `model/types` (`Product`), `model/store`
  (`stockStore` — остатки на складе), `ui/ProductCard` (🔒 только чтение);
- `entities/product/index.ts` — уже отдаёт `Product` и `ProductCard`, но забыл про
  `stockStore`;
- `widgets/product-shelf/ui/ProductShelf.tsx` — тянет `stockStore` глубоким импортом.

## Требования

1. В `index.ts` реэкспортируйте `stockStore` из `./model/store`.
2. В `ProductShelf.tsx` замените глубокий импорт `stockStore` на импорт из
   `@/entities/product`.
3. Нажмите «Проверить».

## Чеклист

- [ ] `index.ts` отдаёт `Product`, `ProductCard`, `stockStore`
- [ ] `ProductShelf.tsx` импортирует всё из `@/entities/product`
- [ ] Нет глубоких импортов
- [ ] Пройти квиз уровня ≥ 80%
