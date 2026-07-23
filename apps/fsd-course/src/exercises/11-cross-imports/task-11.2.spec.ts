import { fileContains, fileExists, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 11.2 (среднее) — Двусторонний @x-контракт.
 *
 * Теперь связь нужна в обе стороны: `entities/product` хочет показать в карточке
 * товара короткое имя продавца (`UserPreview` из `entities/user`), а
 * `entities/user` хочет показать бейдж «избранный товар» (`ProductPreview` из
 * `entities/product`). Каждая сущность публикует свой @x-контракт для конкретного
 * соседа, а сосед подключает именно этот файл — не полный public API и не глубокий
 * импорт.
 */

const userTypes = `export interface User {
  id: string
  name: string
}
`
const userIndex = `export type { User } from './model/types'
`

const productTypes = `export interface Product {
  id: string
  title: string
}
`
const productIndex = `export type { Product } from './model/types'
`

// TODO для ученика: entities/user отдаёт узкую проекцию себя для entities/product.
const xProductStart = `// TODO: entities/product ожидает узкую проекцию User — только id и name.
// Реэкспортируйте её здесь под именем UserPreview.
export {}
`
const xProductSolution = `export type { User as UserPreview } from '../model/types'
`

// TODO для ученика: entities/product отдаёт узкую проекцию себя для entities/user.
const xUserStart = `// TODO: entities/user ожидает узкую проекцию Product — только id и title.
// Реэкспортируйте её здесь под именем ProductPreview.
export {}
`
const xUserSolution = `export type { Product as ProductPreview } from '../model/types'
`

const productCardStart = `import type { Product } from '../model/types'

// TODO: покажите короткое имя продавца. Импортируйте UserPreview из
// '@/entities/user/@x/product' и добавьте проп seller.
export function ProductCard({ product }: { product: Product }) {
  return <strong>{product.title}</strong>
}
`
const productCardSolution = `import type { UserPreview } from '@/entities/user/@x/product'
import type { Product } from '../model/types'

export function ProductCard({ product, seller }: { product: Product; seller: UserPreview }) {
  return (
    <div className="product-card">
      <strong>{product.title}</strong>
      <span>{seller.name}</span>
    </div>
  )
}
`

const favoriteBadgeStart = `// TODO: покажите название избранного товара. Импортируйте ProductPreview из
// '@/entities/product/@x/user' и добавьте проп favorite.

export function FavoriteProductBadge() {
  return null
}
`
const favoriteBadgeSolution = `import type { ProductPreview } from '@/entities/product/@x/user'

export function FavoriteProductBadge({ favorite }: { favorite: ProductPreview }) {
  return <span className="favorite-badge">{favorite.title}</span>
}
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/entities/product/model/types.ts', content: productTypes, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '11.2',
  title: 'Задание 11.2 — Двусторонний @x-контракт (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/user/@x/product.ts', content: xProductStart, role: 'editable' },
    { path: 'src/entities/product/@x/user.ts', content: xUserStart, role: 'editable' },
    { path: 'src/entities/product/ui/ProductCard.tsx', content: productCardStart, role: 'editable' },
    {
      path: 'src/entities/user/ui/FavoriteProductBadge.tsx',
      content: favoriteBadgeStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/user/@x/product.ts', content: xProductSolution, role: 'editable' },
    { path: 'src/entities/product/@x/user.ts', content: xUserSolution, role: 'editable' },
    { path: 'src/entities/product/ui/ProductCard.tsx', content: productCardSolution, role: 'editable' },
    {
      path: 'src/entities/user/ui/FavoriteProductBadge.tsx',
      content: favoriteBadgeSolution,
      role: 'editable',
    },
  ],
  checks: [
    fileExists('src/entities/user/@x/product.ts'),
    fileExists('src/entities/product/@x/user.ts'),
    fileContains(
      'src/entities/user/@x/product.ts',
      /export .*User/,
      '`user/@x/product.ts` реэкспортирует тип, связанный с `User`'
    ),
    fileContains(
      'src/entities/product/@x/user.ts',
      /export .*Product/,
      '`product/@x/user.ts` реэкспортирует тип, связанный с `Product`'
    ),
    fileContains(
      'src/entities/product/ui/ProductCard.tsx',
      /@x\/product/,
      'ProductCard подключает продавца через `@/entities/user/@x/product`'
    ),
    fileContains(
      'src/entities/user/ui/FavoriteProductBadge.tsx',
      /@x\/user/,
      'FavoriteProductBadge подключает товар через `@/entities/product/@x/user`'
    ),
  ],
}
