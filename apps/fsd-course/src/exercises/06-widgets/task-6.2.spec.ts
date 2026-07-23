import { fileContains, importsRespectLayers, noDeepImport, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 6.2 (среднее) — Композиция через public API соседей.
 *
 * `widgets/product-card` компонует `entities/product` и `features/add-to-cart`, но
 * лезет в их внутренние сегменты напрямую. А `pages/catalog`, потребляя сам виджет,
 * тоже обходит его public API. Задача: перевести оба файла на импорт через `index.ts`
 * соответствующих слайсов — `@/entities/product`, `@/features/add-to-cart`,
 * `@/widgets/product-card`.
 */

const productTypes = `export interface Product {
  id: string
  title: string
  price: number
}
`

const productPrice = `import type { Product } from '../model/types'

export function ProductPrice({ product }: { product: Product }) {
  return <span className="product-price">{product.price} ₽</span>
}
`

const productIndex = `export type { Product } from './model/types'
export { ProductPrice } from './ui/ProductPrice'
`

const addToCartButton = `export function AddToCartButton({ productId }: { productId: string }) {
  return <button className="add-to-cart" data-product-id={productId}>В корзину</button>
}
`

const addToCartIndex = `export { AddToCartButton } from './ui/AddToCartButton'
`

// НАРУШЕНИЕ: виджет тянет entities/product и features/add-to-cart в обход их public API.
const productCardStart = `import type { Product } from '@/entities/product/model/types'
import { ProductPrice } from '@/entities/product/ui/ProductPrice'
import { AddToCartButton } from '@/features/add-to-cart/ui/AddToCartButton'

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <strong>{product.title}</strong>
      <ProductPrice product={product} />
      <AddToCartButton productId={product.id} />
    </div>
  )
}
`

const productCardSolution = `import { ProductPrice, type Product } from '@/entities/product'
import { AddToCartButton } from '@/features/add-to-cart'

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <strong>{product.title}</strong>
      <ProductPrice product={product} />
      <AddToCartButton productId={product.id} />
    </div>
  )
}
`

const productCardIndex = `export { ProductCard } from './ui/ProductCard'
`

// НАРУШЕНИЕ: страница тянет виджет в обход его public API.
const catalogPageStart = `import { ProductCard } from '@/widgets/product-card/ui/ProductCard'
import type { Product } from '@/entities/product'

const demoProduct: Product = { id: '1', title: 'Кружка', price: 490 }

export function CatalogPage() {
  return (
    <div className="catalog-page">
      <ProductCard product={demoProduct} />
    </div>
  )
}
`

const catalogPageSolution = `import { ProductCard } from '@/widgets/product-card'
import type { Product } from '@/entities/product'

const demoProduct: Product = { id: '1', title: 'Кружка', price: 490 }

export function CatalogPage() {
  return (
    <div className="catalog-page">
      <ProductCard product={demoProduct} />
    </div>
  )
}
`

const roFiles = [
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
  { path: 'src/entities/product/ui/ProductPrice.tsx', content: productPrice, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
  {
    path: 'src/features/add-to-cart/ui/AddToCartButton.tsx',
    content: addToCartButton,
    role: 'readonly' as const,
  },
  { path: 'src/features/add-to-cart/index.ts', content: addToCartIndex, role: 'readonly' as const },
  { path: 'src/widgets/product-card/index.ts', content: productCardIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '6.2',
  title: 'Задание 6.2 — Композиция через public API соседей (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/widgets/product-card/ui/ProductCard.tsx', content: productCardStart, role: 'editable' },
    { path: 'src/pages/catalog/ui/CatalogPage.tsx', content: catalogPageStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/widgets/product-card/ui/ProductCard.tsx', content: productCardSolution, role: 'editable' },
    { path: 'src/pages/catalog/ui/CatalogPage.tsx', content: catalogPageSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/widgets/product-card/ui/ProductCard.tsx',
      /from\s*'@\/entities\/product'/,
      'ProductCard берёт Product/ProductPrice через public API `@/entities/product`'
    ),
    fileContains(
      'src/widgets/product-card/ui/ProductCard.tsx',
      /from\s*'@\/features\/add-to-cart'/,
      'ProductCard берёт AddToCartButton через public API `@/features/add-to-cart`'
    ),
    fileContains(
      'src/pages/catalog/ui/CatalogPage.tsx',
      /from\s*'@\/widgets\/product-card'/,
      'Страница подключает виджет через public API `@/widgets/product-card`'
    ),
  ],
}
