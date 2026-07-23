# Задание 9.6 — Три слайса: глубокие импорты и цикл разом (сложное)

## Цель

Собрать всё вместе: построить корректный public API слайса, убрать глубокие импорты и разорвать цикл длиной 3 между тремя слайсами.

## Что дано

- `entities/user/model/user.ts` хранит `latestReview: Review`, импортируя `Review` напрямую из `entities/review/model/review.ts`.
- `entities/review/model/review.ts` хранит `product: Product`, импортируя `Product` напрямую из `entities/product/model/product.ts`.
- `entities/product/model/product.ts` хранит `addedBy: User`, импортируя `User` напрямую из `entities/user/model/user.ts`.
- Получился цикл `user → review → product → user`, причём каждое звено — глубокий импорт мимо public API.
- `entities/user/index.ts` — **пуст**, его нужно заполнить.

## Требования

1. В `entities/user/model/user.ts` замените `latestReview: Review` на `latestReviewId: string`, уберите импорт `Review`.
2. В `entities/review/model/review.ts` замените `product: Product` на `productId: string`, уберите импорт `Product`.
3. В `entities/product/model/product.ts` замените `addedBy: User` на `addedById: string`, уберите импорт `User`.
4. Соберите public API `entities/user/index.ts`: реэкспортируйте `User` из `./model/user`.
5. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `User` хранит `latestReviewId: string`
- [ ] `Review` хранит `productId: string`
- [ ] `Product` хранит `addedById: string`
- [ ] Все три глубоких импорта убраны
- [ ] `entities/user/index.ts` реэкспортирует `User`
- [ ] Проверка `noDeepImport` — зелёная
- [ ] Проверка `noRuntimeCycles` — зелёная
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Цикл из трёх звеньев ничем принципиально не отличается от цикла из двух: DFS находит его точно так же. Приём разрыва — тот же самый, что и в 9.2/9.5: заменить вложенный объект на идентификатор в КАЖДОМ из трёх звеньев. А отсутствие public API у `entities/user` — отдельная, независимая проблема, которую тоже нужно закрыть.
