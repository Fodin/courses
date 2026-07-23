import { noRuntimeCycles, fileExists, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 12.5 (среднее) — два общих куска кода → shared с двумя модулями.
 *
 * `@repo/a` и `@repo/b` дублируют зависимость сразу на ДВЕ общие утилиты:
 * `formatPrice` (живёт в a) и `normalizeCurrency` (живёт в b) — каждый пакет
 * тянет недостающую половину у соседа, отсюда цикл. Нужно развести обе
 * утилиты по отдельным модулям `@repo/shared` (`price.ts` и `currency.ts`),
 * собрать их в `index.ts`, и переключить оба пакета на `@repo/shared`.
 */

const aIndexStart = `import { normalizeCurrency } from '@repo/b'

// TODO: formatPrice — общая утилита. Перенесите её в packages/shared/src/price.ts
// и импортируйте обе утилиты (formatPrice, normalizeCurrency) из @repo/shared.
export function formatPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}

export function priceLabel(cents: number, currency: string): string {
  return formatPrice(cents) + ' ' + normalizeCurrency(currency)
}
`

const aIndexSolution = `import { formatPrice, normalizeCurrency } from '@repo/shared'

export function priceLabel(cents: number, currency: string): string {
  return formatPrice(cents) + ' ' + normalizeCurrency(currency)
}
`

const bIndexStart = `import { formatPrice } from '@repo/a'

// TODO: normalizeCurrency — тоже общая утилита. Перенесите её в
// packages/shared/src/currency.ts и импортируйте formatPrice из @repo/shared
// вместо @repo/a.
export function normalizeCurrency(code: string): string {
  return code.trim().toUpperCase()
}

export function receiptLine(cents: number): string {
  return 'Total: ' + formatPrice(cents)
}
`

const bIndexSolution = `import { formatPrice } from '@repo/shared'

export function receiptLine(cents: number): string {
  return 'Total: ' + formatPrice(cents)
}
`

const sharedIndexStart = `// TODO: соберите здесь реэкспорты из ./price и ./currency,
// после того как перенесёте туда formatPrice и normalizeCurrency.
`

const sharedIndexSolution = `export { formatPrice } from './price'
export { normalizeCurrency } from './currency'
`

const sharedPriceStart = `// TODO: перенесите сюда formatPrice() из @repo/a.
export {}
`

const sharedPriceSolution = `export function formatPrice(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}
`

const sharedCurrencyStart = `// TODO: перенесите сюда normalizeCurrency() из @repo/b.
export {}
`

const sharedCurrencySolution = `export function normalizeCurrency(code: string): string {
  return code.trim().toUpperCase()
}
`

export const spec: LabSpec = {
  id: '12.5',
  title: 'Задание 12.5 — Shared-пакет из двух модулей (среднее)',
  aliases: {
    '@repo/a': 'packages/a/src',
    '@repo/b': 'packages/b/src',
    '@repo/shared': 'packages/shared/src',
  },
  files: [
    { path: 'packages/a/src/index.ts', content: aIndexStart, role: 'editable' },
    { path: 'packages/b/src/index.ts', content: bIndexStart, role: 'editable' },
    { path: 'packages/shared/src/index.ts', content: sharedIndexStart, role: 'editable' },
    { path: 'packages/shared/src/price.ts', content: sharedPriceStart, role: 'editable' },
    { path: 'packages/shared/src/currency.ts', content: sharedCurrencyStart, role: 'editable' },
  ],
  solution: [
    { path: 'packages/a/src/index.ts', content: aIndexSolution, role: 'editable' },
    { path: 'packages/b/src/index.ts', content: bIndexSolution, role: 'editable' },
    { path: 'packages/shared/src/index.ts', content: sharedIndexSolution, role: 'editable' },
    { path: 'packages/shared/src/price.ts', content: sharedPriceSolution, role: 'editable' },
    { path: 'packages/shared/src/currency.ts', content: sharedCurrencySolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileExists('packages/shared/src/price.ts'),
    fileExists('packages/shared/src/currency.ts'),
    fileContains(
      'packages/shared/src/index.ts',
      /from ['"]\.\/price['"]/,
      '`@repo/shared/index.ts` реэкспортирует `price.ts`'
    ),
    fileContains(
      'packages/shared/src/index.ts',
      /from ['"]\.\/currency['"]/,
      '`@repo/shared/index.ts` реэкспортирует `currency.ts`'
    ),
    fileContains(
      'packages/b/src/index.ts',
      /from ['"]@repo\/shared['"]/,
      '`@repo/b` импортирует общее из `@repo/shared`, а не из `@repo/a`'
    ),
  ],
}
