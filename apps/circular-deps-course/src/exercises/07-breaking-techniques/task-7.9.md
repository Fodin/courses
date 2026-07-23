# Задание 7.9 — Вынос общего в третий модуль применяется дважды (сложное)

## Цель

Разорвать два независимых двусторонних цикла — `pricing.ts ↔ discount.ts` и `shipping.ts ↔ address.ts` — вынеся каждую пару типов в свой собственный третий модуль.

## Что дано

- `pricing.ts` ↔ `discount.ts` — взаимно импортируют `PriceRule`/`Discount`;
- `shipping.ts` ↔ `address.ts` — взаимно импортируют `ShippingZone`/`AddressZone`;
- `price-types.ts` и `shipping-types.ts` — пустые заготовки с `// TODO`.

## Требования

1. В `price-types.ts` объявите `PriceRule` и `Discount`; `pricing.ts` и `discount.ts` должны импортировать их оттуда через `import type` и не импортировать друг друга.
2. В `shipping-types.ts` объявите `ShippingZone` и `AddressZone`; `shipping.ts` и `address.ts` должны импортировать их оттуда через `import type` и не импортировать друг друга.
3. Приём «третий модуль» здесь применяется дважды — для двух независимых пар файлов.
4. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `price-types.ts` содержит `PriceRule` и `Discount`
- [ ] `pricing.ts` и `discount.ts` не импортируют друг друга
- [ ] `shipping-types.ts` содержит `ShippingZone` и `AddressZone`
- [ ] `shipping.ts` и `address.ts` не импортируют друг друга
- [ ] Цикл в графе импортов отсутствует (в обоих местах)
- [ ] Пройти квиз уровня ≥ 80%
