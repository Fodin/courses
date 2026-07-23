import { noRuntimeCycles, type LabSpec } from 'src/engine'

/**
 * Задание 10.3 (сложное) — Ревью: два независимых цикла в модуле.
 *
 * В модуле спрятаны ДВА никак не связанных друг с другом цикла:
 * 1) `features/checkout/model/cart.ts` ↔ `.../pricing.ts` — `pricing.ts`
 *    тянет `CartItem` только как тип, чинится `import type`.
 * 2) `entities/product/model/product.ts` ↔ `.../catalog.ts` — `CATALOG_VERSION`
 *    нужен только внутри функции, а не на этапе загрузки модуля, чинится
 *    заменой статического импорта на динамический `import()`.
 * Оба цикла нужно устранить, причём разными приёмами.
 */

const cartStart = `import { calculateTotal } from './pricing'

export interface CartItem {
  id: string
  qty: number
}

export function summarize(items: CartItem[]): number {
  return calculateTotal(items)
}
`

const pricingStart = `import { CartItem } from './cart'

// TODO: CartItem используется только как тип — разорви цикл
export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0)
}
`

const pricingSolution = `import type { CartItem } from './cart'

export function calculateTotal(items: CartItem[]): number {
  return items.reduce((sum, item) => sum + item.qty, 0)
}
`

const catalogStart = `import { describeProduct } from './product'

export const CATALOG_VERSION = 2

export function logProduct(product: { id: string; name: string }): void {
  console.log(describeProduct(product))
}
`

const productStart = `import { CATALOG_VERSION } from './catalog'

export interface Product {
  id: string
  name: string
}

// TODO: CATALOG_VERSION нужен только внутри функции — используй динамический import()
export function describeProduct(product: Product): string {
  return \`\${product.name} (catalog v\${CATALOG_VERSION})\`
}
`

const productSolution = `export interface Product {
  id: string
  name: string
}

export async function describeProduct(product: Product): Promise<string> {
  const { CATALOG_VERSION } = await import('./catalog')
  return \`\${product.name} (catalog v\${CATALOG_VERSION})\`
}
`

const roFiles = [
  { path: 'src/features/checkout/model/cart.ts', content: cartStart, role: 'readonly' as const },
  {
    path: 'src/entities/product/model/catalog.ts',
    content: catalogStart,
    role: 'readonly' as const,
  },
]

export const spec: LabSpec = {
  id: '10.3',
  title: 'Задание 10.3 — Ревью: два независимых цикла (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/features/checkout/model/pricing.ts', content: pricingStart, role: 'editable' },
    { path: 'src/entities/product/model/product.ts', content: productStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/features/checkout/model/pricing.ts',
      content: pricingSolution,
      role: 'editable',
    },
    { path: 'src/entities/product/model/product.ts', content: productSolution, role: 'editable' },
  ],
  checks: [noRuntimeCycles()],
}
