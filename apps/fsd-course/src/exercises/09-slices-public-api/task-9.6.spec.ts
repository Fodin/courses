import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 9.6 (сложное) — Разрыв цикла между сущностями.
 *
 * `entities/user` ссылается на `entities/product` (любимый товар), а `product` — на
 * `user` (владелец). Два cross-import'а образуют цикл `user ⇄ product`. Задача:
 * разорвать обе связи — хранить идентификаторы (`favoriteProductId`, `ownerId`),
 * а не вложенные объекты.
 */

const userStart = `import type { Product } from '@/entities/product'

export interface User {
  id: string
  name: string
  favorite: Product
}
`
const userSolution = `export interface User {
  id: string
  name: string
  favoriteProductId: string
}
`

const productStart = `import type { User } from '@/entities/user'

export interface Product {
  id: string
  title: string
  owner: User
}
`
const productSolution = `export interface Product {
  id: string
  title: string
  ownerId: string
}
`

const userIndex = `export type { User } from './model/types'
`
const productIndex = `export type { Product } from './model/types'
`

const roFiles = [
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '9.6',
  title: 'Задание 9.6 — Разрыв цикла сущностей (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/user/model/types.ts', content: userStart, role: 'editable' },
    { path: 'src/entities/product/model/types.ts', content: productStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/user/model/types.ts', content: userSolution, role: 'editable' },
    { path: 'src/entities/product/model/types.ts', content: productSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/user/index.ts', 'User', './model/types'),
    exportsFromPublicApi('src/entities/product/index.ts', 'Product', './model/types'),
    fileContains(
      'src/entities/user/model/types.ts',
      /\wId\b\s*:/,
      'User ссылается на товар по идентификатору (напр. favoriteProductId), а не объектом'
    ),
    fileContains(
      'src/entities/product/model/types.ts',
      /\wId\b\s*:/,
      'Product ссылается на владельца по идентификатору (напр. ownerId), а не объектом'
    ),
  ],
}
