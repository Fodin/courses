# Задание 12.4 — Выделить общий пакет shared (простое)

## Цель

Устранить цикл, вызванный тем, что общая утилита живёт «не в том» пакете — вынести её в отдельный пакет `@repo/shared`.

## Что дано

- `packages/a/src/index.ts` — пакет `@repo/a`. Определяет `formatPrice` и вызывает `parseCurrency` из `@repo/b`.
- `packages/b/src/index.ts` — пакет `@repo/b`. Определяет `parseCurrency` и вызывает `formatPrice` обратно из `@repo/a` — это и замыкает цикл.
- `packages/shared/src/index.ts` — новый пакет `@repo/shared`, пока пустая заготовка с `// TODO`.

## Требования

1. Перенесите функцию `formatPrice` из `packages/a/src/index.ts` в `packages/shared/src/index.ts`.
2. В `packages/a/src/index.ts` импортируйте `formatPrice` из `@repo/shared` вместо локального определения.
3. В `packages/b/src/index.ts` замените `import { formatPrice } from '@repo/a'` на `import { formatPrice } from '@repo/shared'`.
4. Связь `@repo/a → @repo/b` (`parseCurrency`) не трогайте — она остаётся однонаправленной и циклов не образует.
5. Нажмите «Проверить» — цикл `@repo/a ↔ @repo/b` должен исчезнуть.

## Чеклист

- [ ] `packages/shared/src/index.ts` определяет `formatPrice`
- [ ] `@repo/a` импортирует `formatPrice` из `@repo/shared`
- [ ] `@repo/b` импортирует `formatPrice` из `@repo/shared`, а не из `@repo/a`
- [ ] В графе рантайм-импортов нет цикла
- [ ] Пройти квиз уровня ≥ 80%

## Как проверить себя

После переноса `@repo/a` и `@repo/b` не должны импортировать друг у друга ничего, кроме `parseCurrency` в направлении `a → b`. Если у вас остался хоть один импорт `@repo/a` внутри `@repo/b`, кроме удалённого `formatPrice`, — цикл не разорван до конца.
