# Задание 9.6 — Разрыв цикла сущностей (сложное)

## Цель

Разорвать взаимную зависимость двух сущностей (цикл `user ⇄ product`).

## Что дано

- `entities/user/model/types.ts` — `User` с полем `favorite: Product` (импорт product);
- `entities/product/model/types.ts` — `Product` с полем `owner: User` (импорт user).

Две сущности ссылаются друг на друга объектами — это cross-import в обе стороны и цикл.

## Требования

1. В `user/model/types.ts` уберите импорт product и замените `favorite: Product` на
   идентификатор, напр. `favoriteProductId: string`.
2. В `product/model/types.ts` уберите импорт user и замените `owner: User` на
   `ownerId: string`.
3. Нажмите «Проверить».

## Чеклист

- [ ] Ни один из файлов не импортирует соседний слайс
- [ ] Обе сущности ссылаются по идентификатору
- [ ] Пройти квиз уровня ≥ 80%
