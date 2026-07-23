import { noRuntimeCycles, fileExists, fileContains, type LabSpec } from 'src/engine'

/**
 * Задание 12.6 (сложное) — распутать граф из четырёх пакетов, выделив общий слой.
 *
 * `@repo/catalog`, `@repo/pricing`, `@repo/cart` тремя разными путями зависят
 * от одной и той же утилиты `formatMoney`, которая по историческим причинам
 * определена прямо внутри `@repo/catalog`:
 *  - `@repo/catalog` вызывает `computeDiscount` из `@repo/pricing` (легитимно);
 *  - `@repo/pricing` вызывает `formatMoney` обратно из `@repo/catalog`
 *    (создаёт цикл catalog ↔ pricing);
 *  - `@repo/pricing` вызывает `addToCart` из `@repo/cart` (легитимно);
 *  - `@repo/cart` тоже вызывает `formatMoney` из `@repo/catalog`.
 *
 * Единственный настоящий цикл — `catalog ↔ pricing`, и рождён он тем, что
 * `formatMoney` живёт не в том пакете. Решение — вынести `formatMoney` в новый
 * пакет `@repo/shared`, на который переключаются все три пакета. После этого
 * остаётся однонаправленный граф: catalog → pricing → cart, все три → shared.
 */

const catalogStart = `import { computeDiscount } from '@repo/pricing'

// TODO: formatMoney нужен трём пакетам (catalog, pricing, cart) — вынесите её
// в @repo/shared и импортируйте оттуда, чтобы @repo/pricing не тянул её
// обратно из @repo/catalog (это и есть цикл catalog <-> pricing).
export function formatMoney(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}

export function listingPrice(cents: number): string {
  return formatMoney(computeDiscount(cents))
}
`

const catalogSolution = `import { computeDiscount } from '@repo/pricing'
import { formatMoney } from '@repo/shared'

export function listingPrice(cents: number): string {
  return formatMoney(computeDiscount(cents))
}
`

const pricingStart = `import { formatMoney } from '@repo/catalog'
import { addToCart } from '@repo/cart'

// TODO: formatMoney берётся из @repo/catalog — именно это и замыкает цикл
// catalog <-> pricing. Переключитесь на @repo/shared, как только formatMoney
// туда переедет.
export function computeDiscount(cents: number): number {
  return Math.round(cents * 0.9)
}

export function applyPricingAndAdd(cents: number): string {
  addToCart(cents)
  return 'Applied: ' + formatMoney(cents)
}
`

const pricingSolution = `import { addToCart } from '@repo/cart'
import { formatMoney } from '@repo/shared'

export function computeDiscount(cents: number): number {
  return Math.round(cents * 0.9)
}

export function applyPricingAndAdd(cents: number): string {
  addToCart(cents)
  return 'Applied: ' + formatMoney(cents)
}
`

const cartStart = `import { formatMoney } from '@repo/catalog'

// TODO: formatMoney тоже стоит брать из @repo/shared, а не из @repo/catalog —
// после переноса formatMoney пакет @repo/catalog не должен быть источником
// этой утилиты ни для кого.
const items: number[] = []

export function addToCart(cents: number): void {
  items.push(cents)
}

export function cartReceipt(): string {
  return items.map(formatMoney).join(', ')
}
`

const cartSolution = `import { formatMoney } from '@repo/shared'

const items: number[] = []

export function addToCart(cents: number): void {
  items.push(cents)
}

export function cartReceipt(): string {
  return items.map(formatMoney).join(', ')
}
`

const sharedStart = `// TODO: перенесите сюда formatMoney() из @repo/catalog — этой утилитой
// должны пользоваться @repo/catalog, @repo/pricing и @repo/cart через
// @repo/shared, а не через прямые импорты друг у друга.
`

const sharedSolution = `export function formatMoney(cents: number): string {
  return '$' + (cents / 100).toFixed(2)
}
`

export const spec: LabSpec = {
  id: '12.6',
  title: 'Задание 12.6 — Распутать граф из четырёх пакетов (сложное)',
  aliases: {
    '@repo/catalog': 'packages/catalog/src',
    '@repo/pricing': 'packages/pricing/src',
    '@repo/cart': 'packages/cart/src',
    '@repo/shared': 'packages/shared/src',
  },
  files: [
    { path: 'packages/catalog/src/index.ts', content: catalogStart, role: 'editable' },
    { path: 'packages/pricing/src/index.ts', content: pricingStart, role: 'editable' },
    { path: 'packages/cart/src/index.ts', content: cartStart, role: 'editable' },
    { path: 'packages/shared/src/index.ts', content: sharedStart, role: 'editable' },
  ],
  solution: [
    { path: 'packages/catalog/src/index.ts', content: catalogSolution, role: 'editable' },
    { path: 'packages/pricing/src/index.ts', content: pricingSolution, role: 'editable' },
    { path: 'packages/cart/src/index.ts', content: cartSolution, role: 'editable' },
    { path: 'packages/shared/src/index.ts', content: sharedSolution, role: 'editable' },
  ],
  checks: [
    noRuntimeCycles(),
    fileExists('packages/shared/src/index.ts'),
    fileContains(
      'packages/shared/src/index.ts',
      /export function formatMoney/,
      '`@repo/shared` определяет `formatMoney`'
    ),
    fileContains(
      'packages/catalog/src/index.ts',
      /from ['"]@repo\/shared['"]/,
      '`@repo/catalog` берёт `formatMoney` из `@repo/shared`'
    ),
    fileContains(
      'packages/pricing/src/index.ts',
      /from ['"]@repo\/shared['"]/,
      '`@repo/pricing` берёт `formatMoney` из `@repo/shared`'
    ),
    fileContains(
      'packages/cart/src/index.ts',
      /from ['"]@repo\/shared['"]/,
      '`@repo/cart` берёт `formatMoney` из `@repo/shared`'
    ),
  ],
}
