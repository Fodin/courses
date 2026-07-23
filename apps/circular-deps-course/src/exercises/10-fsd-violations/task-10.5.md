# Задание 10.5 — Несколько нарушений сразу: цикл + глубокий импорт (среднее)

## Цель

Найти в модуле одновременно обход public API и рантайм-цикл, который он создаёт вместе с обратной зависимостью, и починить оба нарушения.

## Что дано

- `src/entities/order/model/types.ts` (только для чтения) — интерфейс `Order`.
- `src/entities/order/index.ts` (редактируется) — публичный API слайса, пока не экспортирует `validateCoupon`.
- `src/entities/order/lib/coupon-validator.ts` (редактируется) — `validateCoupon` импортирует `notifyCouponApplied` из `features/checkout`, хотя это не его забота.
- `src/features/checkout/index.ts` (редактируется) — импортирует `validateCoupon` НАПРЯМУЮ из `entities/order/lib/coupon-validator.ts`, минуя `entities/order/index.ts`.

Обход public API и обратный импорт `coupon-validator.ts → features/checkout` вместе замыкают рантайм-цикл.

## Требования

1. Не редактируйте `entities/order/model/types.ts` — он уже корректен.
2. Добавьте `validateCoupon` в публичный экспорт `entities/order/index.ts`.
3. Измените `features/checkout/index.ts` так, чтобы он импортировал `validateCoupon` через `entities/order` (public API), а не напрямую из `lib/coupon-validator.ts`.
4. Уберите из `coupon-validator.ts` импорт и вызов `notifyCouponApplied` — уведомление о применённом купоне должно быть заботой `checkout`, а не самого валидатора.
5. После правок в проекте не должно быть рантайм-цикла импортов и обхода public API.

## Чеклист

- [ ] `entities/order/index.ts` экспортирует `validateCoupon`
- [ ] `features/checkout/index.ts` импортирует `validateCoupon` из `entities/order`, а не из `lib/coupon-validator`
- [ ] `coupon-validator.ts` больше не импортирует ничего из `features`
- [ ] Проверка «нет рантайм-цикла» — зелёная
- [ ] Проверка «нет глубокого импорта» — зелёная
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

1. Нажмите «Проверить» — обе проверки должны стать зелёными.
2. Откройте «Показать эталон», если не получается.
3. Найдите в теории раздел про «Нарушение 3: обход public API» и сравните с этим заданием — обратите внимание, что скрытое ребро тут и правда неожиданно замкнуло цикл, как описано в теории.
