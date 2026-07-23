import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 14.6 (сложное) — Финальный шаг: собираем экран.
 *
 * Сущность `entities/product`, фича `features/add-to-cart` и виджет
 * `widgets/product-card-widget` уже мигрированы и закрыты public API (даны
 * только для чтения). Осталось собрать саму страницу — `pages/catalog`.
 * Сейчас страница тянет и виджет, и фичу, и сущность в обход их public API.
 * Задача: переключить все импорты страницы на public API и закрыть public
 * API самой страницы — граф импортов должен идти строго вниз по слоям.
 */

const productTypes = `export interface Product {
  id: string
  title: string
}
`
const productIndex = `export type { Product } from './model/types'
`

const addToCartButton = `export function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => console.log('cart: added', productId)}>В корзину</button>
}
`
const addToCartIndex = `export { AddToCartButton } from './ui/AddToCartButton'
`

const widgetUi = `import type { Product } from '@/entities/product'
import { AddToCartButton } from '@/features/add-to-cart'

export function ProductCardWidget({ product }: { product: Product }) {
  return (
    <div className="product-card-widget">
      <h3>{product.title}</h3>
      <AddToCartButton productId={product.id} />
    </div>
  )
}
`
const widgetIndex = `export { ProductCardWidget } from './ui/ProductCardWidget'
`

// Страница — нарушение: обходит public API виджета, фичи и сущности.
const pageStart = `import { ProductCardWidget } from '@/widgets/product-card-widget/ui/ProductCardWidget'
import { AddToCartButton } from '@/features/add-to-cart/ui/AddToCartButton'
import type { Product } from '@/entities/product/model/types'

const featured: Product = { id: 'p1', title: 'Клавиатура' }

export function CatalogPage() {
  return (
    <main>
      <h1>Каталог</h1>
      <ProductCardWidget product={featured} />
      <section>
        <h2>Быстрая покупка</h2>
        <AddToCartButton productId={featured.id} />
      </section>
    </main>
  )
}
`

const pageSolution = `import { ProductCardWidget } from '@/widgets/product-card-widget'
import { AddToCartButton } from '@/features/add-to-cart'
import type { Product } from '@/entities/product'

const featured: Product = { id: 'p1', title: 'Клавиатура' }

export function CatalogPage() {
  return (
    <main>
      <h1>Каталог</h1>
      <ProductCardWidget product={featured} />
      <section>
        <h2>Быстрая покупка</h2>
        <AddToCartButton productId={featured.id} />
      </section>
    </main>
  )
}
`

const pageIndexStart = `// Public API страницы pages/catalog.
// TODO: реэкспортируйте CatalogPage.
`
const pageIndexSolution = `export { CatalogPage } from './ui/CatalogPage'
`

const roFiles = [
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
  {
    path: 'src/features/add-to-cart/ui/AddToCartButton.tsx',
    content: addToCartButton,
    role: 'readonly' as const,
  },
  { path: 'src/features/add-to-cart/index.ts', content: addToCartIndex, role: 'readonly' as const },
  {
    path: 'src/widgets/product-card-widget/ui/ProductCardWidget.tsx',
    content: widgetUi,
    role: 'readonly' as const,
  },
  { path: 'src/widgets/product-card-widget/index.ts', content: widgetIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '14.6',
  title: 'Задание 14.6 — Финальный шаг: собираем экран (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/pages/catalog/ui/CatalogPage.tsx', content: pageStart, role: 'editable' },
    { path: 'src/pages/catalog/index.ts', content: pageIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/pages/catalog/ui/CatalogPage.tsx', content: pageSolution, role: 'editable' },
    { path: 'src/pages/catalog/index.ts', content: pageIndexSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/pages/catalog/ui/CatalogPage.tsx',
      /from\s*'@\/widgets\/product-card-widget'/,
      'Страница импортирует ProductCardWidget из public API `@/widgets/product-card-widget`'
    ),
    fileContains(
      'src/pages/catalog/ui/CatalogPage.tsx',
      /from\s*'@\/features\/add-to-cart'/,
      'Страница импортирует AddToCartButton из public API `@/features/add-to-cart`'
    ),
    fileContains(
      'src/pages/catalog/ui/CatalogPage.tsx',
      /from\s*'@\/entities\/product'/,
      'Страница импортирует Product из public API `@/entities/product`'
    ),
    exportsFromPublicApi('src/pages/catalog/index.ts', 'CatalogPage', './ui/CatalogPage'),
  ],
}
