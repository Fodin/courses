import { fileContains, fileExists, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 11.3 (сложное) — Навести порядок: заменить глубокий cross-import
 * корректным @x-контрактом с обеих сторон.
 *
 * `entities/user` и `entities/product` ссылаются друг на друга напрямую и
 * глубоко — `import ... from '@/entities/product/model/types'` и наоборот. Это и
 * cross-import соседнего слайса, и обход public API одновременно. Задача: для
 * каждой стороны завести @x-контракт (`user/@x/product.ts`, `product/@x/user.ts`)
 * с узкими проекциями (`UserPreview`, `ProductPreview`) и переключить модели на
 * импорт именно из них.
 */

const userIndex = `export type { User } from './model/types'
`
const productIndex = `export type { Product } from './model/types'
`

// НАРУШЕНИЕ: глубокий импорт в обход public API соседней сущности того же слоя.
const userTypesStart = `import type { Product } from '@/entities/product/model/types'

export interface User {
  id: string
  name: string
  favoriteProduct: Product
}
`
const userTypesSolution = `import type { ProductPreview } from '@/entities/product/@x/user'

export interface User {
  id: string
  name: string
  favoriteProduct: ProductPreview
}
`

// НАРУШЕНИЕ: глубокий импорт в обход public API соседней сущности того же слоя.
const productTypesStart = `import type { User } from '@/entities/user/model/types'

export interface Product {
  id: string
  title: string
  seller: User
}
`
const productTypesSolution = `import type { UserPreview } from '@/entities/user/@x/product'

export interface Product {
  id: string
  title: string
  seller: UserPreview
}
`

const xProductStart = `// TODO: entities/product ожидает узкую проекцию User — реэкспортируйте её здесь
// под именем UserPreview.
export {}
`
const xProductSolution = `export type { User as UserPreview } from '../model/types'
`

const xUserStart = `// TODO: entities/user ожидает узкую проекцию Product — реэкспортируйте её здесь
// под именем ProductPreview.
export {}
`
const xUserSolution = `export type { Product as ProductPreview } from '../model/types'
`

const roFiles = [
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '11.3',
  title: 'Задание 11.3 — Глубокий cross-import → @x с обеих сторон (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/user/model/types.ts', content: userTypesStart, role: 'editable' },
    { path: 'src/entities/product/model/types.ts', content: productTypesStart, role: 'editable' },
    { path: 'src/entities/user/@x/product.ts', content: xProductStart, role: 'editable' },
    { path: 'src/entities/product/@x/user.ts', content: xUserStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/user/model/types.ts', content: userTypesSolution, role: 'editable' },
    { path: 'src/entities/product/model/types.ts', content: productTypesSolution, role: 'editable' },
    { path: 'src/entities/user/@x/product.ts', content: xProductSolution, role: 'editable' },
    { path: 'src/entities/product/@x/user.ts', content: xUserSolution, role: 'editable' },
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
      'src/entities/user/model/types.ts',
      /@x\/user/,
      'User получает Product через `@/entities/product/@x/user`, а не глубоким импортом в model/types.ts'
    ),
    fileContains(
      'src/entities/product/model/types.ts',
      /@x\/product/,
      'Product получает User через `@/entities/user/@x/product`, а не глубоким импортом в model/types.ts'
    ),
  ],
}
