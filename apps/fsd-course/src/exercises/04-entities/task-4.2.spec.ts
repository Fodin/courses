import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 4.2 (среднее) — Новый сегмент сущности и его public API.
 *
 * У `entities/product` появился сегмент `model/store` (остатки товара на складе).
 * Public API уже отдаёт `Product` и `ProductCard`, но забыл про `stockStore` — и
 * виджет `widgets/product-shelf` тянет его глубоким импортом. Задача: дописать
 * `index.ts`, реэкспортировав `stockStore`, и перевести виджет на public API.
 */

const productTypes = `export interface Product {
  id: string
  title: string
  price: number
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

const stockStore = `export const stockStore = {
  quantityByProductId: {} as Record<string, number>,
}
`

// НАРУШЕНИЕ: index.ts не знает про новый сегмент model/store.
const indexStart = `export type { Product } from './model/types'
export { ProductCard } from './ui/ProductCard'
// TODO: реэкспортируйте stockStore из './model/store'
`

const indexSolution = `export type { Product } from './model/types'
export { ProductCard } from './ui/ProductCard'
export { stockStore } from './model/store'
`

// НАРУШЕНИЕ: виджет тянет новый сегмент глубоким импортом, минуя public API.
const shelfStart = `import { ProductCard, type Product } from '@/entities/product'
import { stockStore } from '@/entities/product/model/store'

export function ProductShelf({ products }: { products: Product[] }) {
  return (
    <div className="product-shelf">
      {products.map(product => (
        <div key={product.id}>
          <ProductCard product={product} />
          <span>В наличии: {stockStore.quantityByProductId[product.id] ?? 0}</span>
        </div>
      ))}
    </div>
  )
}
`

const shelfSolution = `import { ProductCard, stockStore, type Product } from '@/entities/product'

export function ProductShelf({ products }: { products: Product[] }) {
  return (
    <div className="product-shelf">
      {products.map(product => (
        <div key={product.id}>
          <ProductCard product={product} />
          <span>В наличии: {stockStore.quantityByProductId[product.id] ?? 0}</span>
        </div>
      ))}
    </div>
  )
}
`

const roFiles = [
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
  { path: 'src/entities/product/model/store.ts', content: stockStore, role: 'readonly' as const },
  { path: 'src/entities/product/ui/ProductCard.tsx', content: productCard, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '4.2',
  title: 'Задание 4.2 — Новый сегмент и его public API (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/product/index.ts', content: indexStart, role: 'editable' },
    { path: 'src/widgets/product-shelf/ui/ProductShelf.tsx', content: shelfStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/product/index.ts', content: indexSolution, role: 'editable' },
    { path: 'src/widgets/product-shelf/ui/ProductShelf.tsx', content: shelfSolution, role: 'editable' },
  ],
  checks: [
    exportsFromPublicApi('src/entities/product/index.ts', 'stockStore', './model/store'),
    noDeepImport(),
    importsRespectLayers(),
    fileContains(
      'src/widgets/product-shelf/ui/ProductShelf.tsx',
      /from\s*'@\/entities\/product'/,
      'Виджет импортирует stockStore через public API `@/entities/product`'
    ),
  ],
}
