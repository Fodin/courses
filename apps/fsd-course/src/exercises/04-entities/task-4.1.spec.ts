import { exportsFromPublicApi, fileExists, sliceHasSegments, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 4.1 (простое) — Устройство сущности и её public API.
 *
 * Дано: слайс `entities/product` с сегментами `model/` (типы) и `ui/` (карточка), но
 * без публичного API. Задача: описать `index.ts`, реэкспортировав наружу тип `Product`
 * и компонент `ProductCard` — «поставить входную дверь» на сущность.
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

const indexStart = `// Public API слайса entities/product.
// TODO: реэкспортируйте наружу тип Product и компонент ProductCard,
// чтобы внешний код не лез во внутренние сегменты слайса.
`

const indexSolution = `export type { Product } from './model/types'
export { ProductCard } from './ui/ProductCard'
`

export const spec: FsdTaskSpec = {
  id: '4.1',
  title: 'Задание 4.1 — Устройство сущности и public API (простое)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' },
    { path: 'src/entities/product/ui/ProductCard.tsx', content: productCard, role: 'readonly' },
    { path: 'src/entities/product/index.ts', content: indexStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' },
    { path: 'src/entities/product/ui/ProductCard.tsx', content: productCard, role: 'readonly' },
    { path: 'src/entities/product/index.ts', content: indexSolution, role: 'editable' },
  ],
  checks: [
    fileExists('src/entities/product/index.ts'),
    sliceHasSegments('src/entities/product', ['model', 'ui']),
    exportsFromPublicApi('src/entities/product/index.ts', 'Product', './model/types'),
    exportsFromPublicApi('src/entities/product/index.ts', 'ProductCard', './ui/ProductCard'),
  ],
}
