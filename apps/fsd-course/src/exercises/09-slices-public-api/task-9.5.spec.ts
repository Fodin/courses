import {
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 9.5 (среднее) — Cross-import в UI и композиция через слот.
 *
 * `entities/product/ui/ProductCard` рендерит продавца, импортируя `UserCard` из
 * соседнего слайса `entities/user` — cross-import в UI. Задача: убрать импорт, а
 * место под продавца отдать пропом-слотом `sellerSlot`. Кто положит туда `UserCard` —
 * решает виджет `widgets/catalog` (он уже написан правильно, только чтение).
 */

const userTypes = `export interface User {
  id: string
  name: string
}
`
const userCard = `import type { User } from '../model/types'

export function UserCard({ user }: { user: User }) {
  return <span className="user-card">{user.name}</span>
}
`
const userIndex = `export type { User } from './model/types'
export { UserCard } from './ui/UserCard'
`

const productTypes = `export interface Product {
  id: string
  title: string
  sellerId: string
}
`
const productIndex = `export type { Product } from './model/types'
export { ProductCard } from './ui/ProductCard'
`

// НАРУШЕНИЕ: ui продукта тянет ui чужой сущности того же слоя.
const productCardStart = `import type { Product } from '../model/types'
import { UserCard } from '@/entities/user'

export function ProductCard({ product, seller }: { product: Product; seller: { name: string } }) {
  return (
    <div className="product-card">
      <strong>{product.title}</strong>
      <UserCard user={{ id: product.sellerId, name: seller.name }} />
    </div>
  )
}
`

const productCardSolution = `import type { ReactNode } from 'react'
import type { Product } from '../model/types'

export function ProductCard({ product, sellerSlot }: { product: Product; sellerSlot?: ReactNode }) {
  return (
    <div className="product-card">
      <strong>{product.title}</strong>
      {sellerSlot}
    </div>
  )
}
`

// Виджет — правильная композиция: обе сущности встречаются здесь.
const widget = `import { ProductCard, type Product } from '@/entities/product'
import { UserCard, type User } from '@/entities/user'

export function CatalogItem({ product, seller }: { product: Product; seller: User }) {
  return <ProductCard product={product} sellerSlot={<UserCard user={seller} />} />
}
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/ui/UserCard.tsx', content: userCard, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
  { path: 'src/widgets/catalog/ui/CatalogItem.tsx', content: widget, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '9.5',
  title: 'Задание 9.5 — Cross-import в UI (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/product/ui/ProductCard.tsx', content: productCardStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/entities/product/ui/ProductCard.tsx',
      content: productCardSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/entities/product/ui/ProductCard.tsx',
      /sellerSlot/,
      'Продавец приходит через проп-слот `sellerSlot`, а не импортом соседнего слайса'
    ),
  ],
}
