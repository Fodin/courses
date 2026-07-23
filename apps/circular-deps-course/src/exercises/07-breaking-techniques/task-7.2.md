# Задание 7.2 — Инверсия зависимости в цепочке из трёх модулей (среднее)

## Цель

Разорвать цикл длиной 3: `order.ts → notifier.ts → formatter.ts → order.ts`, применив внедрение зависимости на обоих «обратных» участках цепочки.

## Что дано

- `order.ts` — экспортирует `Order`, `logOrderEvent`, `createOrder`; вызывает `notifyOrderCreated` из `notifier.ts`;
- `notifier.ts` — вызывает `formatOrderSummary` из `formatter.ts`;
- `formatter.ts` — импортирует `logOrderEvent` обратно из `order.ts` — это и замыкает цикл.

## Требования

1. В `formatter.ts` уберите импорт `logOrderEvent` из `./order`; функция `formatOrderSummary` должна принимать `logOrderEvent` вторым параметром.
2. В `notifier.ts` функция `notifyOrderCreated` должна принимать `logOrderEvent` вторым параметром и передавать его дальше в `formatOrderSummary`.
3. В `order.ts` при вызове `notifyOrderCreated` передайте `logOrderEvent` вторым аргументом.
4. `notifier.ts` может оставить `import type { Order } from './order'` — это не создаёт рантайм-ребро.
5. Нажмите «Проверить» — все проверки должны стать зелёными.

## Чеклист

- [ ] `formatter.ts` не импортирует `order.ts` как значение
- [ ] `formatOrderSummary` принимает `logOrderEvent` параметром
- [ ] `notifyOrderCreated` принимает `logOrderEvent` параметром и прокидывает его дальше
- [ ] Цикл в графе импортов отсутствует
- [ ] Пройти квиз уровня ≥ 80%
