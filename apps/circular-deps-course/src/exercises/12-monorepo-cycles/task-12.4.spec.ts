import { noRuntimeCycles, fileExists, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 12.4 (простое) — выделить общий пакет.
 *
 * `@repo/a` и `@repo/b` взаимозависимы: `@repo/a` определяет общую утилиту
 * `formatPrice` и заодно вызывает `parseCurrency` из `@repo/b`, а `@repo/b`,
 * в свою очередь, тянет `formatPrice` обратно из `@repo/a` — классический
 * цикл, рождённый тем, что общий код живёт «не в том» пакете.
 *
 * Пакет `packages/shared/src/index.ts` уже заведён как редактируемая заготовка
 * (`// TODO`) — перенесите туда `formatPrice`, и оба пакета получат её оттуда.
 */

const aIndexStart = `import { parseCurrency } from '@repo/b'

// TODO: formatPrice — общая утилита, нужная и @repo/a, и @repo/b. Она не
// принадлежит именно пакету a — перенесите её в @repo/shared и импортируйте
// оттуда, вместо того чтобы @repo/b тянул её обратно из @repo/a.
export function formatPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}

export function totalPrice(cents: number, currency: string): string {
  return formatPrice(cents) + ' ' + parseCurrency(currency)
}
`

const aIndexSolution = `import { parseCurrency } from '@repo/b'
import { formatPrice } from '@repo/shared'

export function totalPrice(cents: number, currency: string): string {
  return formatPrice(cents) + ' ' + parseCurrency(currency)
}
`

const bIndexStart = `import { formatPrice } from '@repo/a'

export function parseCurrency(code: string): string {
  return code.toUpperCase()
}

export function receipt(cents: number): string {
  return 'Receipt: ' + formatPrice(cents)
}
`

const bIndexSolution = `import { formatPrice } from '@repo/shared'

export function parseCurrency(code: string): string {
  return code.toUpperCase()
}

export function receipt(cents: number): string {
  return 'Receipt: ' + formatPrice(cents)
}
`

const sharedIndexStart = `// TODO: перенесите сюда formatPrice() из @repo/a — оба пакета (@repo/a и
// @repo/b) должны импортировать её отсюда, а не друг у друга.
`

const sharedIndexSolution = `export function formatPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}
`

export const spec: LabSpec = {
  id: '12.4',
  title: 'Задание 12.4 — Выделить общий пакет shared (простое)',
  aliases: {
    '@repo/a': 'packages/a/src',
    '@repo/b': 'packages/b/src',
    '@repo/shared': 'packages/shared/src',
  },
  files: [
    { path: 'packages/a/src/index.ts', content: aIndexStart, role: 'editable' },
    { path: 'packages/b/src/index.ts', content: bIndexStart, role: 'editable' },
    { path: 'packages/shared/src/index.ts', content: sharedIndexStart, role: 'editable' },
  ],
  solution: [
    { path: 'packages/a/src/index.ts', content: aIndexSolution, role: 'editable' },
    { path: 'packages/b/src/index.ts', content: bIndexSolution, role: 'editable' },
    { path: 'packages/shared/src/index.ts', content: sharedIndexSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileExists('packages/shared/src/index.ts'),
    fileContains(
      'packages/shared/src/index.ts',
      /export function formatPrice/,
      '`@repo/shared` определяет `formatPrice`'
    ),
    fileContains(
      'packages/b/src/index.ts',
      /from ['"]@repo\/shared['"]/,
      '`@repo/b` импортирует `formatPrice` из `@repo/shared`, а не из `@repo/a`'
    ),
  ],
}
