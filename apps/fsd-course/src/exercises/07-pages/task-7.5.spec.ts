import {
  exportsFromPublicApi,
  fileContains,
  fileExists,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 7.5 (среднее) — Запрос вниз, в api-сегмент сущности.
 *
 * Страница `pages/product-list` сама делает `fetch` к бэкенду прямо в
 * компоненте. Задача: реализовать `getProducts` в `entities/product/api`,
 * собрать её в public API сущности и переключить страницу на готовую
 * функцию — сама страница фетчей знать не должна.
 */

const productTypes = `export interface Product {
  id: string
  title: string
}
`

const getProductsStart = `import type { Product } from '../model/types'

// TODO: реализуйте запрос списка товаров и верните Product[].
export const getProducts = async (): Promise<Product[]> => {
  throw new Error('not implemented')
}
`

const getProductsSolution = `import type { Product } from '../model/types'

export const getProducts = async (): Promise<Product[]> => {
  const res = await fetch('/api/products')
  return res.json()
}
`

const productIndexStart = `export type { Product } from './model/types'
// TODO: реэкспортируйте getProducts из api-сегмента.
`
const productIndexSolution = `export type { Product } from './model/types'
export { getProducts } from './api/getProducts'
`

// НАРУШЕНИЕ: страница сама делает запрос к API вместо entities/product.
const productListStart = `import { useEffect, useState } from 'react'
import type { Product } from '@/entities/product'

export function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    fetch('/api/products')
      .then(res => res.json())
      .then(setProducts)
  }, [])

  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  )
}
`

const productListSolution = `import { useEffect, useState } from 'react'
import { getProducts, type Product } from '@/entities/product'

export function ProductListPage() {
  const [products, setProducts] = useState<Product[]>([])

  useEffect(() => {
    getProducts().then(setProducts)
  }, [])

  return (
    <ul>
      {products.map(p => (
        <li key={p.id}>{p.title}</li>
      ))}
    </ul>
  )
}
`

const roFiles = [
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '7.5',
  title: 'Задание 7.5 — Запрос вниз, в api-сегмент сущности (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/entities/product/api/getProducts.ts',
      content: getProductsStart,
      role: 'editable',
    },
    { path: 'src/entities/product/index.ts', content: productIndexStart, role: 'editable' },
    {
      path: 'src/pages/product-list/ui/ProductListPage.tsx',
      content: productListStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/entities/product/api/getProducts.ts',
      content: getProductsSolution,
      role: 'editable',
    },
    { path: 'src/entities/product/index.ts', content: productIndexSolution, role: 'editable' },
    {
      path: 'src/pages/product-list/ui/ProductListPage.tsx',
      content: productListSolution,
      role: 'editable',
    },
  ],
  checks: [
    fileExists('src/entities/product/api/getProducts.ts'),
    fileContains(
      'src/entities/product/api/getProducts.ts',
      /export const getProducts/,
      '`getProducts` реализована в entities/product/api'
    ),
    exportsFromPublicApi('src/entities/product/index.ts', 'getProducts', './api/getProducts'),
    fileContains(
      'src/pages/product-list/ui/ProductListPage.tsx',
      /^(?:(?!fetch\().)*$/s,
      'Страница больше не делает fetch напрямую — запрос ушёл в entities/product'
    ),
    fileContains(
      'src/pages/product-list/ui/ProductListPage.tsx',
      /from\s*'@\/entities\/product'/,
      'getProducts импортируется из public API `@/entities/product`'
    ),
    importsRespectLayers(),
    noDeepImport(),
  ],
}
