# Задание 12.6 — Код-ревью: несколько нарушений сразу (сложное)

## Цель

Провести код-ревью модуля `features/order-review` и починить все найденные
нарушения границ FSD.

## Что дано

В `features/order-review/model/review.ts` сразу четыре проблемы:

1. Глубокий импорт `Order` из `entities/order/model/types` мимо public API.
2. Импорт вверх — `formatDate` из `pages/orders/lib/format-date`.
3. Cross-import соседнего слайса `features/customer-badge`.
4. Доменная сущность `Discount` лежит в `shared/lib/discount.ts` вместо
   `entities/discount`.

## Требования

1. Импортируйте `Order` из `@/entities/order` (публичный API уже готов).
2. Уберите зависимость от `pages/orders/lib/format-date` — используйте
   `review.createdAt` как есть, без форматирования.
3. Уберите зависимость от `features/customer-badge`.
4. Перенесите `Discount` и `applyDiscount` из `shared/lib/discount.ts` в
   `entities/discount` (сегмент `model`, файл `discount.ts`), заполните
   `entities/discount/index.ts` и добавьте поле `discount: Discount` в
   `OrderReview`, импортируя тип из `@/entities/discount`.
5. Нажмите «Проверить».

## Чеклист

- [ ] `review.ts` импортирует `Order` и `Customer` только через public API сущностей
- [ ] `review.ts` не зависит от `pages/orders` и `features/customer-badge`
- [ ] `shared/lib/discount.ts` больше не содержит домена
- [ ] `entities/discount/index.ts` экспортирует `Discount` и `applyDiscount`
- [ ] Пройти квиз уровня ≥ 80%
