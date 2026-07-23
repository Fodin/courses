import { exportsFromPublicApi, fileContains, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 15.2 (среднее) — Антипаттерн: god-slice / раздутый public API.
 *
 * Барель `entities/product/index.ts` реэкспортирует всё подряд через `export *`,
 * из-за чего наружу утекает приватный сегмент `model/internalCache` (внутренний кэш
 * слайса, никогда не задумывавшийся как публичный). Задача: сузить public API до
 * именованных реэкспортов только того, что реально нужно снаружи — типа `Product` и
 * компонента `ProductCard`, — не трогая `internalCache` вовсе.
 */

const productTypes = `export interface Product {
  id: string
  title: string
  price: number
}
`

// Внутренний кэш слайса — НЕ часть public API, наружу не выносится.
const internalCache = `const cache = new Map<string, unknown>()

export function warmCache(key: string, value: unknown) {
  cache.set(key, value)
}

export function clearCache() {
  cache.clear()
}
`

const productCard = `import type { Product } from '../model/types'

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <strong>{product.title}</strong>
      <span>{product.price} ₽</span>
    </div>
  )
}
`

// НАРУШЕНИЕ: export * тянет наружу всё, включая приватный internalCache.
const indexStart = `export * from './model/types'
export * from './model/internalCache'
export * from './ui/ProductCard'
`

const indexSolution = `export type { Product } from './model/types'
export { ProductCard } from './ui/ProductCard'
`

// Обычный потребитель — читает только то, что должно остаться публичным.
const catalogLite = `import { type Product, ProductCard } from '@/entities/product'

export function CatalogLite({ products }: { products: Product[] }) {
  return (
    <div>
      {products.map(p => (
        <ProductCard key={p.id} product={p} />
      ))}
    </div>
  )
}
`

const roFiles = [
  {
    path: 'src/entities/product/model/types.ts',
    content: productTypes,
    role: 'readonly' as const,
  },
  {
    path: 'src/entities/product/model/internalCache.ts',
    content: internalCache,
    role: 'readonly' as const,
  },
  {
    path: 'src/entities/product/ui/ProductCard.tsx',
    content: productCard,
    role: 'readonly' as const,
  },
  {
    path: 'src/widgets/catalog-lite/ui/CatalogLite.tsx',
    content: catalogLite,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '15.2',
  title: 'Задание 15.2 — Раздутый public API (среднее)',
  aliases: { '@': 'src' },
  files: [...roFiles, { path: 'src/entities/product/index.ts', content: indexStart, role: 'editable' }],
  solution: [
    ...roFiles,
    { path: 'src/entities/product/index.ts', content: indexSolution, role: 'editable' },
  ],
  checks: [
    exportsFromPublicApi('src/entities/product/index.ts', 'Product', './model/types'),
    exportsFromPublicApi('src/entities/product/index.ts', 'ProductCard', './ui/ProductCard'),
    fileContains(
      'src/entities/product/index.ts',
      /^(?:(?!export \*).)*$/s,
      'index.ts использует именованные реэкспорты, а не `export *` (иначе утечёт всё приватное)'
    ),
    fileContains(
      'src/entities/product/index.ts',
      /^(?:(?!internalCache).)*$/s,
      'index.ts не реэкспортирует внутренний сегмент `model/internalCache` — он остаётся приватным'
    ),
  ],
}
