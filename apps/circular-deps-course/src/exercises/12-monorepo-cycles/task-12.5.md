# Задание 12.5 — Shared-пакет из двух модулей (среднее)

## Цель

Развести ДВЕ общие утилиты, дублирующие зависимость между пакетами, по отдельным модулям одного shared-пакета.

## Что дано

- `packages/a/src/index.ts` — пакет `@repo/a`. Определяет `formatPrice`, вызывает `normalizeCurrency` из `@repo/b`.
- `packages/b/src/index.ts` — пакет `@repo/b`. Определяет `normalizeCurrency`, вызывает `formatPrice` обратно из `@repo/a` — вместе с предыдущим пунктом это замыкает цикл.
- `packages/shared/src/index.ts`, `packages/shared/src/price.ts`, `packages/shared/src/currency.ts` — заготовки нового пакета `@repo/shared` (пока `// TODO`).

## Требования

1. Перенесите `formatPrice` в `packages/shared/src/price.ts`.
2. Перенесите `normalizeCurrency` в `packages/shared/src/currency.ts`.
3. В `packages/shared/src/index.ts` реэкспортируйте обе функции: `export { formatPrice } from './price'` и `export { normalizeCurrency } from './currency'`.
4. В `packages/a/src/index.ts` и `packages/b/src/index.ts` импортируйте нужные утилиты из `@repo/shared` вместо прямых импортов друг у друга.
5. После этого `@repo/a` и `@repo/b` не должны импортировать друг друга напрямую вовсе.
6. Нажмите «Проверить» — цикл `@repo/a ↔ @repo/b` должен исчезнуть.

## Чеклист

- [ ] `packages/shared/src/price.ts` определяет `formatPrice`
- [ ] `packages/shared/src/currency.ts` определяет `normalizeCurrency`
- [ ] `packages/shared/src/index.ts` реэкспортирует оба модуля
- [ ] `@repo/a` и `@repo/b` больше не импортируют друг друга напрямую
- [ ] В графе рантайм-импортов нет цикла
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

Если после рефакторинга открыть `packages/a/src/index.ts` и `packages/b/src/index.ts`, в них не должно остаться ни одного `from '@repo/a'` внутри `b` и ни одного `from '@repo/b'` внутри `a` — единственная связь между ними теперь идёт через `@repo/shared`.
