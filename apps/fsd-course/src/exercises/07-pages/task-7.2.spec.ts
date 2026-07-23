import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 7.2 (среднее) — Композиция без глубоких импортов.
 *
 * `pages/product` собирает виджет `widgets/product-card` и фичу
 * `features/add-to-cart`, но лезет во внутренние сегменты обоих мимо их
 * public API. Задача: перевести оба импорта на public API и закрыть
 * собственный `index.ts` страницы.
 */

const productCard = `export function ProductCard({ title, price }: { title: string; price: number }) {
  return (
    <div className="product-card">
      <strong>{title}</strong>
      <span>{price} ₽</span>
    </div>
  )
}
`
const productCardIndex = `export { ProductCard } from './ui/ProductCard'
`

const addToCartButton = `export function AddToCartButton({ productId }: { productId: string }) {
  return <button onClick={() => console.log('add to cart', productId)}>В корзину</button>
}
`
const addToCartIndex = `export { AddToCartButton } from './ui/AddToCartButton'
`

// НАРУШЕНИЕ: страница лезет во внутренние сегменты виджета и фичи.
const productPageStart = `import { ProductCard } from '@/widgets/product-card/ui/ProductCard'
import { AddToCartButton } from '@/features/add-to-cart/ui/AddToCartButton'

export function ProductPage() {
  return (
    <div className="product-page">
      <ProductCard title="Клавиатура" price={4990} />
      <AddToCartButton productId="kbd-1" />
    </div>
  )
}
`

const productPageSolution = `import { ProductCard } from '@/widgets/product-card'
import { AddToCartButton } from '@/features/add-to-cart'

export function ProductPage() {
  return (
    <div className="product-page">
      <ProductCard title="Клавиатура" price={4990} />
      <AddToCartButton productId="kbd-1" />
    </div>
  )
}
`

const pageIndexStart = `// Public API страницы pages/product.
// TODO: реэкспортируйте ProductPage.
`
const pageIndexSolution = `export { ProductPage } from './ui/ProductPage'
`

const roFiles = [
  {
    path: 'src/widgets/product-card/ui/ProductCard.tsx',
    content: productCard,
    role: 'readonly' as const,
  },
  {
    path: 'src/widgets/product-card/index.ts',
    content: productCardIndex,
    role: 'readonly' as const,
  },
  {
    path: 'src/features/add-to-cart/ui/AddToCartButton.tsx',
    content: addToCartButton,
    role: 'readonly' as const,
  },
  {
    path: 'src/features/add-to-cart/index.ts',
    content: addToCartIndex,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '7.2',
  title: 'Задание 7.2 — Композиция без глубоких импортов (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/pages/product/ui/ProductPage.tsx', content: productPageStart, role: 'editable' },
    { path: 'src/pages/product/index.ts', content: pageIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/pages/product/ui/ProductPage.tsx',
      content: productPageSolution,
      role: 'editable',
    },
    { path: 'src/pages/product/index.ts', content: pageIndexSolution, role: 'editable' },
  ],
  checks: [
    noDeepImport(),
    importsRespectLayers(),
    exportsFromPublicApi('src/pages/product/index.ts', 'ProductPage', './ui/ProductPage'),
    fileContains(
      'src/pages/product/ui/ProductPage.tsx',
      /from\s*'@\/widgets\/product-card'/,
      'ProductCard импортируется через public API виджета `@/widgets/product-card`'
    ),
    fileContains(
      'src/pages/product/ui/ProductPage.tsx',
      /from\s*'@\/features\/add-to-cart'/,
      'AddToCartButton импортируется через public API фичи `@/features/add-to-cart`'
    ),
  ],
}
