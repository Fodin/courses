import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 2.6 (сложное) — Собрать однонаправленную цепочку из пяти слоёв.
 *
 * Куски фичи «лайк товара» разбросаны неправильно:
 * - `entities/product` не отдаёт публичный API (пустой index.ts);
 * - `features/like-button` не отдаёт публичный API и вдобавок тянет иконку из
 *   `widgets/product-card` вместо `shared/ui` (импорт вверх + глубокий импорт);
 * - `widgets/product-card` запрашивает товар у `pages/catalog` вместо того, чтобы
 *   принять его пропом (импорт вверх).
 *
 * Задача: собрать корректную цепочку `pages → widgets → features → entities →
 * shared`, где каждый слой знает только о том, что лежит строго ниже.
 */

const iconTsx = `export function Icon({ name }: { name: string }) {
  return <span className={\`icon icon-\${name}\`} />
}
`
const sharedUiIndex = `export { Icon } from './Icon'
`

const productTypes = `export interface Product {
  id: string
  title: string
}
`
const productIndexStart = `// TODO: реэкспортируйте тип Product из ./model/types
`
const productIndexSolution = `export type { Product } from './model/types'
`

const likeStore = `const liked = new Set<string>()

export function toggleLike(productId: string): void {
  if (liked.has(productId)) liked.delete(productId)
  else liked.add(productId)
}

export function isLiked(productId: string): boolean {
  return liked.has(productId)
}
`

// Мусор: дублирующая копия иконки, ошибочно оказавшаяся в widgets.
const widgetIconDecoy = `// ВНИМАНИЕ: это дублирующая копия иконки, ошибочно оказавшаяся в widgets.
// Настоящая иконка живёт в shared/ui/Icon.tsx — импортируйте оттуда.
export function Icon({ name }: { name: string }) {
  return <span className={\`icon icon-\${name}\`} />
}
`

// НАРУШЕНИЕ: features импортирует Icon из widgets (выше по стеку) вместо shared.
const likeButtonStart = `import { Icon } from '@/widgets/product-card/ui/Icon'
import { toggleLike, isLiked } from '../model/likeStore'
import type { Product } from '@/entities/product'

export function LikeButton({ product }: { product: Product }) {
  return (
    <button onClick={() => toggleLike(product.id)}>
      <Icon name={isLiked(product.id) ? 'heart-filled' : 'heart'} />
    </button>
  )
}
`

const likeButtonSolution = `import { Icon } from '@/shared/ui'
import { toggleLike, isLiked } from '../model/likeStore'
import type { Product } from '@/entities/product'

export function LikeButton({ product }: { product: Product }) {
  return (
    <button onClick={() => toggleLike(product.id)}>
      <Icon name={isLiked(product.id) ? 'heart-filled' : 'heart'} />
    </button>
  )
}
`

const likeButtonIndexStart = `// TODO: реэкспортируйте LikeButton из ./ui/LikeButton
`
const likeButtonIndexSolution = `export { LikeButton } from './ui/LikeButton'
`

// НАРУШЕНИЕ: widgets импортирует функцию из pages (выше по стеку) вместо пропа.
const productCardStart = `import { getFeaturedProduct } from '@/pages/catalog'
import { LikeButton } from '@/features/like-button'

export function ProductCard() {
  const product = getFeaturedProduct()
  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <LikeButton product={product} />
    </div>
  )
}
`

const productCardSolution = `import { LikeButton } from '@/features/like-button'
import type { Product } from '@/entities/product'

export function ProductCard({ product }: { product: Product }) {
  return (
    <div className="product-card">
      <h3>{product.title}</h3>
      <LikeButton product={product} />
    </div>
  )
}
`

const productCardIndex = `export { ProductCard } from './ui/ProductCard'
`

const catalogPageStart = `import { ProductCard } from '@/widgets/product-card'
import type { Product } from '@/entities/product'

const demoProduct: Product = { id: '1', title: 'Кроссовки' }

export function getFeaturedProduct(): Product {
  return demoProduct
}

export function CatalogPage() {
  return (
    <main>
      <ProductCard />
    </main>
  )
}
`

const catalogPageSolution = `import { ProductCard } from '@/widgets/product-card'
import type { Product } from '@/entities/product'

const demoProduct: Product = { id: '1', title: 'Кроссовки' }

export function CatalogPage() {
  return (
    <main>
      <ProductCard product={demoProduct} />
    </main>
  )
}
`

const catalogIndex = `export { CatalogPage } from './ui/CatalogPage'
`

const roFiles = [
  { path: 'src/shared/ui/Icon.tsx', content: iconTsx, role: 'readonly' as const },
  { path: 'src/shared/ui/index.ts', content: sharedUiIndex, role: 'readonly' as const },
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
  { path: 'src/features/like-button/model/likeStore.ts', content: likeStore, role: 'readonly' as const },
  {
    path: 'src/widgets/product-card/ui/Icon.tsx',
    content: widgetIconDecoy,
    role: 'readonly' as const,
  },
  {
    path: 'src/widgets/product-card/index.ts',
    content: productCardIndex,
    role: 'readonly' as const,
  },
  { path: 'src/pages/catalog/index.ts', content: catalogIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '2.6',
  title: 'Задание 2.6 — Однонаправленная цепочка из пяти слоёв (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/product/index.ts', content: productIndexStart, role: 'editable' },
    {
      path: 'src/features/like-button/ui/LikeButton.tsx',
      content: likeButtonStart,
      role: 'editable',
    },
    { path: 'src/features/like-button/index.ts', content: likeButtonIndexStart, role: 'editable' },
    {
      path: 'src/widgets/product-card/ui/ProductCard.tsx',
      content: productCardStart,
      role: 'editable',
    },
    { path: 'src/pages/catalog/ui/CatalogPage.tsx', content: catalogPageStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/product/index.ts', content: productIndexSolution, role: 'editable' },
    {
      path: 'src/features/like-button/ui/LikeButton.tsx',
      content: likeButtonSolution,
      role: 'editable',
    },
    {
      path: 'src/features/like-button/index.ts',
      content: likeButtonIndexSolution,
      role: 'editable',
    },
    {
      path: 'src/widgets/product-card/ui/ProductCard.tsx',
      content: productCardSolution,
      role: 'editable',
    },
    { path: 'src/pages/catalog/ui/CatalogPage.tsx', content: catalogPageSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/product/index.ts', 'Product', './model/types'),
    exportsFromPublicApi('src/features/like-button/index.ts', 'LikeButton', './ui/LikeButton'),
    fileContains(
      'src/features/like-button/ui/LikeButton.tsx',
      /from\s*'@\/shared\/ui'/,
      'LikeButton берёт Icon из shared/ui, а не из дубликата в widgets'
    ),
    fileContains(
      'src/widgets/product-card/ui/ProductCard.tsx',
      /product\s*:\s*Product/,
      'ProductCard получает product пропом, а не запрашивает его со страницы'
    ),
    fileContains(
      'src/pages/catalog/ui/CatalogPage.tsx',
      /<ProductCard[^>]*product=\{demoProduct\}/,
      'Страница передаёт продукт в виджет пропом'
    ),
  ],
}
