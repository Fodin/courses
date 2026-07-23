import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 15.6 (сложное) — Капстоун, шаг 3: мини-приложение целиком.
 *
 * Полная вертикаль `pages → widgets → features → entities → shared` для страницы
 * товара: сущность `entities/product` уже закрыта, `shared/ui/Button` и
 * `shared/lib/formatPrice` — переиспользуемые утилиты без бизнес-смысла. Задача:
 * собрать фичу `features/buy-now` (логика + public API), закрыть виджет
 * `widgets/product-page` public API и подключить страницу `pages/product` к виджету —
 * так, чтобы все импорты шли строго вниз по слоям и только через public API.
 */

const productTypes = `export interface Product {
  id: string
  title: string
  price: number
}
`
const productIndex = `export type { Product } from './model/types'
`

const button = `import type { ReactNode } from 'react'

export function Button({ children, onClick }: { children: ReactNode; onClick?: () => void }) {
  return <button onClick={onClick}>{children}</button>
}
`
const formatPrice = `export function formatPrice(price: number): string {
  return \`\${price.toFixed(2)} ₽\`
}
`

const buyNowModelStart = `// TODO: реализуйте placeOrder(product): верните идентификатор заказа вида
// \`order-<product.id>\`. Тип Product импортируйте только через public API
// сущности @/entities/product.
`
const buyNowModelSolution = `import type { Product } from '@/entities/product'

export function placeOrder(product: Product): string {
  return \`order-\${product.id}\`
}
`

const buyNowButton = `import type { Product } from '@/entities/product'
import { Button } from '@/shared/ui/Button'
import { formatPrice } from '@/shared/lib/formatPrice'
import { placeOrder } from '../model/buyNow'

export function BuyNowButton({ product }: { product: Product }) {
  return (
    <Button onClick={() => console.log(placeOrder(product))}>
      Купить за {formatPrice(product.price)}
    </Button>
  )
}
`

const buyNowIndexStart = `// Public API фичи features/buy-now.
// TODO: реэкспортируйте placeOrder из ./model/buyNow и BuyNowButton из
// ./ui/BuyNowButton.
`
const buyNowIndexSolution = `export { placeOrder } from './model/buyNow'
export { BuyNowButton } from './ui/BuyNowButton'
`

// НАРУШЕНИЕ: виджет лезет глубоко в entities и features.
const productPageStart = `import type { Product } from '@/entities/product/model/types'
import { BuyNowButton } from '@/features/buy-now/ui/BuyNowButton'

export function ProductPage({ product }: { product: Product }) {
  return (
    <section>
      <h1>{product.title}</h1>
      <BuyNowButton product={product} />
    </section>
  )
}
`
const productPageSolution = `import type { Product } from '@/entities/product'
import { BuyNowButton } from '@/features/buy-now'

export function ProductPage({ product }: { product: Product }) {
  return (
    <section>
      <h1>{product.title}</h1>
      <BuyNowButton product={product} />
    </section>
  )
}
`

const productPageIndexStart = `// Public API виджета widgets/product-page.
// TODO: реэкспортируйте ProductPage из ./ui/ProductPage.
`
const productPageIndexSolution = `export { ProductPage } from './ui/ProductPage'
`

// НАРУШЕНИЕ: страница лезет во внутренний сегмент виджета.
const productPageRouteStart = `import type { Product } from '@/entities/product'
import { ProductPage } from '@/widgets/product-page/ui/ProductPage'

const demoProduct: Product = { id: 'p1', title: 'Клавиатура', price: 4990 }

export function ProductPageRoute() {
  return <ProductPage product={demoProduct} />
}
`
const productPageRouteSolution = `import type { Product } from '@/entities/product'
import { ProductPage } from '@/widgets/product-page'

const demoProduct: Product = { id: 'p1', title: 'Клавиатура', price: 4990 }

export function ProductPageRoute() {
  return <ProductPage product={demoProduct} />
}
`

const roFiles = [
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
  { path: 'src/shared/ui/Button.tsx', content: button, role: 'readonly' as const },
  { path: 'src/shared/lib/formatPrice.ts', content: formatPrice, role: 'readonly' as const },
  {
    path: 'src/features/buy-now/ui/BuyNowButton.tsx',
    content: buyNowButton,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '15.6',
  title: 'Задание 15.6 — Мини-приложение целиком (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/features/buy-now/model/buyNow.ts', content: buyNowModelStart, role: 'editable' },
    { path: 'src/features/buy-now/index.ts', content: buyNowIndexStart, role: 'editable' },
    {
      path: 'src/widgets/product-page/ui/ProductPage.tsx',
      content: productPageStart,
      role: 'editable',
    },
    {
      path: 'src/widgets/product-page/index.ts',
      content: productPageIndexStart,
      role: 'editable',
    },
    {
      path: 'src/pages/product/ui/ProductPageRoute.tsx',
      content: productPageRouteStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/features/buy-now/model/buyNow.ts',
      content: buyNowModelSolution,
      role: 'editable',
    },
    { path: 'src/features/buy-now/index.ts', content: buyNowIndexSolution, role: 'editable' },
    {
      path: 'src/widgets/product-page/ui/ProductPage.tsx',
      content: productPageSolution,
      role: 'editable',
    },
    {
      path: 'src/widgets/product-page/index.ts',
      content: productPageIndexSolution,
      role: 'editable',
    },
    {
      path: 'src/pages/product/ui/ProductPageRoute.tsx',
      content: productPageRouteSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/features/buy-now/index.ts', 'placeOrder', './model/buyNow'),
    exportsFromPublicApi('src/features/buy-now/index.ts', 'BuyNowButton', './ui/BuyNowButton'),
    exportsFromPublicApi(
      'src/widgets/product-page/index.ts',
      'ProductPage',
      './ui/ProductPage'
    ),
    fileContains(
      'src/pages/product/ui/ProductPageRoute.tsx',
      /from\s*'@\/widgets\/product-page'/,
      'Страница подключает виджет через его public API `@/widgets/product-page`'
    ),
    fileContains(
      'src/features/buy-now/model/buyNow.ts',
      /@\/entities\/product/,
      'Фича обращается к сущности через public API entities/product'
    ),
  ],
}
