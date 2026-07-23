import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 2.3 (сложное) — Мини-граф из трёх слоёв.
 *
 * `widgets/product-page` корректно опирается на `features/wishlist` и
 * `entities/product`. Но внутри графа спрятаны два импорта вверх: сущность
 * `entities/product` зовёт `isWishlisted` из `features/wishlist`, а сам
 * `features/wishlist` зовёт `currentProductId` из `widgets/product-page`.
 * Задача: разорвать обе связи так, чтобы граф стал однонаправленным
 * `widgets → features → entities`.
 */

const productTypes = `export interface Product {
  id: string
  title: string
  stock: number
}
`

// НАРУШЕНИЕ: entity импортирует функцию из features (выше по стеку).
const stockStart = `import { isWishlisted } from '@/features/wishlist'
import type { Product } from './types'

export function getAvailabilityLabel(product: Product): string {
  if (product.stock === 0) return 'Нет в наличии'
  return isWishlisted(product.id) ? 'В вашем списке желаний' : 'В наличии'
}
`

const stockSolution = `import type { Product } from './types'

export function getAvailabilityLabel(product: Product): string {
  return product.stock === 0 ? 'Нет в наличии' : 'В наличии'
}
`

const productIndex = `export type { Product } from './model/types'
export { getAvailabilityLabel } from './model/stock'
`

// НАРУШЕНИЕ: features импортирует значение из widgets (ещё выше по стеку).
const toggleStart = `import { currentProductId } from '@/widgets/product-page'

const wishlist = new Set<string>()

export function toggleWishlist(): void {
  if (wishlist.has(currentProductId)) wishlist.delete(currentProductId)
  else wishlist.add(currentProductId)
}

export function isWishlisted(productId: string): boolean {
  return wishlist.has(productId)
}
`

const toggleSolution = `const wishlist = new Set<string>()

export function toggleWishlist(productId: string): void {
  if (wishlist.has(productId)) wishlist.delete(productId)
  else wishlist.add(productId)
}

export function isWishlisted(productId: string): boolean {
  return wishlist.has(productId)
}
`

const wishlistIndex = `export { toggleWishlist, isWishlisted } from './model/toggle'
`

// Уже корректен: виджет опирается на entities и features сверху вниз.
const productPage = `import { toggleWishlist, isWishlisted } from '@/features/wishlist'
import { getAvailabilityLabel } from '@/entities/product'
import type { Product } from '@/entities/product'

export function ProductPage({ product }: { product: Product }) {
  return (
    <section className="product-page">
      <h2>{product.title}</h2>
      <p>{getAvailabilityLabel(product)}</p>
      <button onClick={() => toggleWishlist(product.id)}>
        {isWishlisted(product.id) ? 'Убрать из списка желаний' : 'В список желаний'}
      </button>
    </section>
  )
}
`

const roFiles = [
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
  { path: 'src/features/wishlist/index.ts', content: wishlistIndex, role: 'readonly' as const },
  {
    path: 'src/widgets/product-page/ui/ProductPage.tsx',
    content: productPage,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '2.3',
  title: 'Задание 2.3 — Мини-граф из трёх слоёв (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/product/model/stock.ts', content: stockStart, role: 'editable' },
    { path: 'src/features/wishlist/model/toggle.ts', content: toggleStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/product/model/stock.ts', content: stockSolution, role: 'editable' },
    { path: 'src/features/wishlist/model/toggle.ts', content: toggleSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/product/index.ts', 'getAvailabilityLabel', './model/stock'),
    exportsFromPublicApi('src/features/wishlist/index.ts', 'toggleWishlist', './model/toggle'),
    fileContains(
      'src/entities/product/model/stock.ts',
      /getAvailabilityLabel\(product: Product\)/,
      'getAvailabilityLabel не зависит от features/wishlist'
    ),
    fileContains(
      'src/features/wishlist/model/toggle.ts',
      /toggleWishlist\(productId: string\)/,
      'toggleWishlist принимает productId параметром, а не тянет его из widgets'
    ),
  ],
}
