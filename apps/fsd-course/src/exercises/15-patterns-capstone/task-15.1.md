# Задание 15.1 — Бизнес-логика в shared (простое)

## Цель

Распознать и исправить антипаттерн «доменная логика в `shared`».

## Что дано

- `shared/lib/orderTotals.ts` — функция `calculateOrderTotal`, которая на самом деле
  является доменной логикой сущности `order`. Она даже импортирует тип `Order` глубоким
  импортом из `entities/order/model/types` — это импорт вверх по слоям, `shared` не
  может зависеть от `entities`.
- `entities/order/model/orderTotals.ts` — пустая заготовка, куда нужно перенести логику.
- `entities/order/index.ts` — пустой public API слайса.
- `widgets/cart-summary/ui/CartSummary.tsx` — потребитель, который сейчас берёт функцию
  из `shared` и тип из `entities` глубоким импортом.

## Требования

1. Перенесите `calculateOrderTotal` из `shared/lib/orderTotals.ts` в
   `entities/order/model/orderTotals.ts`, оставив в shared-файле только комментарий —
   бизнес-логики там быть не должно.
2. Опишите public API `entities/order/index.ts`: реэкспортируйте тип `Order` и функцию
   `calculateOrderTotal`.
3. Переключите `CartSummary` на импорт из `@/entities/order` (public API), уберите
   импорт из `shared` и глубокий импорт типа.
4. Нажмите «Проверить».

## Чеклист

- [ ] `shared/lib/orderTotals.ts` не содержит `calculateOrderTotal`
- [ ] `entities/order/model/orderTotals.ts` содержит перенесённую функцию
- [ ] `entities/order/index.ts` экспортирует `Order` и `calculateOrderTotal`
- [ ] `CartSummary` импортирует всё из `@/entities/order`
- [ ] Пройти квиз уровня ≥ 80%
