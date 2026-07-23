import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 14.3 (сложное) — Раскладываем legacy-модуль по слоям.
 *
 * Каталог товаров собран в трёх legacy-местах: примитив `Avatar` — в
 * `src/components/`, тип `Product` — в `src/utils/`, запрос за товаром —
 * в `src/api/`. Задача: распределить их по правильным слоям FSD
 * (примитив → `shared/ui`, тип и запрос → `entities/product`), собрать
 * из них `ProductCard` и публичный API сущности, переключить потребителя.
 */

// Legacy-источники.
const legacyAvatar = `export function Avatar({ url }: { url: string }) {
  return <img className="legacy-avatar" src={url} />
}
`

const legacyProductType = `export interface Product {
  id: string
  title: string
  imageUrl: string
}
`

const legacyProductApi = `import type { Product } from '../utils/product'

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(\`/api/products/\${id}\`)
  return res.json()
}
`

// Целевые файлы shared.
const avatarStart = `// TODO: перенесите сюда компонент Avatar из 'src/components/Avatar.tsx'.
`
const avatarSolution = `export function Avatar({ url }: { url: string }) {
  return <img className="avatar" src={url} />
}
`

const sharedIndexStart = `// Public API сегмента shared/ui.
// TODO: реэкспортируйте Avatar.
`
const sharedIndexSolution = `export { Avatar } from './Avatar'
`

// Целевые файлы entities/product.
const productTypesStart = `// TODO: перенесите сюда интерфейс Product из 'src/utils/product.ts'.
`
const productTypesSolution = `export interface Product {
  id: string
  title: string
  imageUrl: string
}
`

const fetchProductStart = `// TODO: перенесите сюда функцию fetchProduct из 'src/api/productApi.ts'.
// Тип Product берите из '../model/types' (свой слайс, импортировать можно напрямую).
`
const fetchProductSolution = `import type { Product } from '../model/types'

export async function fetchProduct(id: string): Promise<Product> {
  const res = await fetch(\`/api/products/\${id}\`)
  return res.json()
}
`

const productCardStart = `// TODO: соберите ProductCard из Avatar (shared/ui, через public API)
// и типа Product (свой слайс, '../model/types').
`
const productCardSolution = `import { Avatar } from '@/shared/ui'
import type { Product } from '../model/types'

export function ProductCard({ product }: { product: Product }) {
  return (
    <article className="product-card">
      <Avatar url={product.imageUrl} />
      <h3>{product.title}</h3>
    </article>
  )
}
`

const productIndexStart = `// Public API слайса entities/product.
// TODO: реэкспортируйте Product, fetchProduct и ProductCard.
`
const productIndexSolution = `export type { Product } from './model/types'
export { fetchProduct } from './api/fetchProduct'
export { ProductCard } from './ui/ProductCard'
`

// Потребитель — виджет, сейчас собранный вручную из legacy-кусков.
const consumerStart = `import type { Product } from '@/utils/product'
import { fetchProduct } from '@/api/productApi'
import { Avatar } from '@/components/Avatar'

export function ProductList({ products }: { products: Product[] }) {
  void fetchProduct
  return (
    <ul className="product-list">
      {products.map(p => (
        <li key={p.id}>
          <Avatar url={p.imageUrl} />
          {p.title}
        </li>
      ))}
    </ul>
  )
}
`

const consumerSolution = `import { fetchProduct, ProductCard, type Product } from '@/entities/product'

export function ProductList({ products }: { products: Product[] }) {
  void fetchProduct
  return (
    <ul className="product-list">
      {products.map(p => (
        <li key={p.id}>
          <ProductCard product={p} />
        </li>
      ))}
    </ul>
  )
}
`

export const spec: FsdTaskSpec = {
  id: '14.3',
  title: 'Задание 14.3 — Раскладываем legacy-модуль по слоям (сложное)',
  aliases: { '@': 'src' },
  files: [
    { path: 'src/components/Avatar.tsx', content: legacyAvatar, role: 'readonly' },
    { path: 'src/utils/product.ts', content: legacyProductType, role: 'readonly' },
    { path: 'src/api/productApi.ts', content: legacyProductApi, role: 'readonly' },
    { path: 'src/shared/ui/Avatar.tsx', content: avatarStart, role: 'editable' },
    { path: 'src/shared/ui/index.ts', content: sharedIndexStart, role: 'editable' },
    { path: 'src/entities/product/model/types.ts', content: productTypesStart, role: 'editable' },
    {
      path: 'src/entities/product/api/fetchProduct.ts',
      content: fetchProductStart,
      role: 'editable',
    },
    { path: 'src/entities/product/ui/ProductCard.tsx', content: productCardStart, role: 'editable' },
    { path: 'src/entities/product/index.ts', content: productIndexStart, role: 'editable' },
    { path: 'src/widgets/product-list/ui/ProductList.tsx', content: consumerStart, role: 'editable' },
  ],
  solution: [
    { path: 'src/components/Avatar.tsx', content: legacyAvatar, role: 'readonly' },
    { path: 'src/utils/product.ts', content: legacyProductType, role: 'readonly' },
    { path: 'src/api/productApi.ts', content: legacyProductApi, role: 'readonly' },
    { path: 'src/shared/ui/Avatar.tsx', content: avatarSolution, role: 'editable' },
    { path: 'src/shared/ui/index.ts', content: sharedIndexSolution, role: 'editable' },
    { path: 'src/entities/product/model/types.ts', content: productTypesSolution, role: 'editable' },
    {
      path: 'src/entities/product/api/fetchProduct.ts',
      content: fetchProductSolution,
      role: 'editable',
    },
    {
      path: 'src/entities/product/ui/ProductCard.tsx',
      content: productCardSolution,
      role: 'editable',
    },
    { path: 'src/entities/product/index.ts', content: productIndexSolution, role: 'editable' },
    {
      path: 'src/widgets/product-list/ui/ProductList.tsx',
      content: consumerSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/shared/ui/index.ts', 'Avatar', './Avatar'),
    fileContains(
      'src/entities/product/model/types.ts',
      /interface Product/,
      '`entities/product/model/types.ts` содержит интерфейс Product'
    ),
    fileContains(
      'src/entities/product/api/fetchProduct.ts',
      /export async function fetchProduct/,
      '`entities/product/api/fetchProduct.ts` содержит перенесённый запрос'
    ),
    fileContains(
      'src/entities/product/ui/ProductCard.tsx',
      /from\s*'@\/shared\/ui'/,
      'ProductCard берёт Avatar через public API `@/shared/ui`'
    ),
    exportsFromPublicApi('src/entities/product/index.ts', 'Product', './model/types'),
    exportsFromPublicApi('src/entities/product/index.ts', 'fetchProduct', './api/fetchProduct'),
    exportsFromPublicApi('src/entities/product/index.ts', 'ProductCard', './ui/ProductCard'),
    fileContains(
      'src/widgets/product-list/ui/ProductList.tsx',
      /from\s*'@\/entities\/product'/,
      'ProductList импортирует Product, fetchProduct и ProductCard из public API `@/entities/product`'
    ),
  ],
}
