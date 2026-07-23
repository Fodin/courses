# Задание 7.5 — Запрос вниз, в api-сегмент сущности (среднее)

## Цель

Вынести сетевой запрос из страницы в api-сегмент сущности.

## Что дано

- `entities/product/model/types.ts` — тип `Product` (только чтение).
- `entities/product/api/getProducts.ts` — заготовка с `TODO`, бросает ошибку.
- `entities/product/index.ts` — заготовка public API, `getProducts` ещё не
  реэкспортирована.
- `pages/product-list/ui/ProductListPage.tsx` — сама делает `fetch` внутри
  компонента.

## Требования

1. В `entities/product/api/getProducts.ts` реализуйте запрос: `fetch` на
   `/api/products` и возврат `res.json()`.
2. В `entities/product/index.ts` реэкспортируйте `getProducts` из
   `./api/getProducts`.
3. В `ProductListPage.tsx` уберите прямой `fetch` и вызовите `getProducts()`
   из `@/entities/product`.
4. Нажмите «Проверить».

## Чеклист

- [ ] `getProducts` реализована в `entities/product/api`
- [ ] `getProducts` доступна через public API `entities/product`
- [ ] В `ProductListPage.tsx` больше нет прямого `fetch`
- [ ] Пройти квиз уровня ≥ 80%
