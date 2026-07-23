import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 14.5 (среднее) — Собираем виджет из мигрированных кусков.
 *
 * Сущность `entities/product` и фича `features/add-to-cart` уже перенесены
 * и закрыты public API (даны только для чтения). Виджет `ProductCardWidget`
 * их использует, но тянет напрямую внутренние сегменты — это тоже нарушение,
 * просто на следующем шаге миграции. Задача: собрать виджет строго через
 * public API сущности и фичи и закрыть публичный API самого виджета.
 */

// Уже мигрированные сущность и фича — только для чтения.
const productTypes = `export interface Product {
  id: string
  title: string
}
`
const productCard = `import type { Product } from '../model/types'

export function ProductCard({ product }: { product: Product }) {
  return <h3>{product.title}</h3>
}
`
const productIndex = `export type { Product } from './model/types'
export { ProductCard } from './ui/ProductCard'
`

const addToCartModel = `export function addToCart(productId: string): void {
  console.log('cart: added', productId)
}
`
const addToCartButton = `import { addToCart } from '../model/addToCart'

export function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => addToCart(productId)}>В корзину</button>
}
`
const addToCartIndex = `export { AddToCartButton } from './ui/AddToCartButton'
`

// Виджет — нарушение: тянет внутренние сегменты чужих слайсов напрямую.
const widgetStart = `import { ProductCard } from '@/entities/product/ui/ProductCard'
import type { Product } from '@/entities/product/model/types'
import { AddToCartButton } from '@/features/add-to-cart/ui/AddToCartButton'

export function ProductCardWidget({ product }: { product: Product }) {
  return (
    <div className="product-card-widget">
      <ProductCard product={product} />
      <AddToCartButton productId={product.id} />
    </div>
  )
}
`

const widgetSolution = `import { ProductCard, type Product } from '@/entities/product'
import { AddToCartButton } from '@/features/add-to-cart'

export function ProductCardWidget({ product }: { product: Product }) {
  return (
    <div className="product-card-widget">
      <ProductCard product={product} />
      <AddToCartButton productId={product.id} />
    </div>
  )
}
`

const widgetIndexStart = `// Public API виджета widgets/product-card-widget.
// TODO: реэкспортируйте ProductCardWidget.
`
const widgetIndexSolution = `export { ProductCardWidget } from './ui/ProductCardWidget'
`

const roFiles = [
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
  { path: 'src/entities/product/ui/ProductCard.tsx', content: productCard, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
  {
    path: 'src/features/add-to-cart/model/addToCart.ts',
    content: addToCartModel,
    role: 'readonly' as const,
  },
  {
    path: 'src/features/add-to-cart/ui/AddToCartButton.tsx',
    content: addToCartButton,
    role: 'readonly' as const,
  },
  { path: 'src/features/add-to-cart/index.ts', content: addToCartIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '14.5',
  title: 'Задание 14.5 — Собираем виджет из мигрированных кусков (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/widgets/product-card-widget/ui/ProductCardWidget.tsx', content: widgetStart, role: 'editable' },
    { path: 'src/widgets/product-card-widget/index.ts', content: widgetIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/widgets/product-card-widget/ui/ProductCardWidget.tsx',
      content: widgetSolution,
      role: 'editable',
    },
    { path: 'src/widgets/product-card-widget/index.ts', content: widgetIndexSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/widgets/product-card-widget/ui/ProductCardWidget.tsx',
      /from\s*'@\/entities\/product'/,
      'Виджет импортирует Product и ProductCard из public API `@/entities/product`'
    ),
    fileContains(
      'src/widgets/product-card-widget/ui/ProductCardWidget.tsx',
      /from\s*'@\/features\/add-to-cart'/,
      'Виджет импортирует AddToCartButton из public API `@/features/add-to-cart`'
    ),
    exportsFromPublicApi(
      'src/widgets/product-card-widget/index.ts',
      'ProductCardWidget',
      './ui/ProductCardWidget'
    ),
  ],
}
