import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 9.4 (простое) — Разрыв cross-import между сущностями.
 *
 * Сущность `entities/product` напрямую импортирует `entities/user` того же слоя и
 * встраивает объект `User` в `Product`. Задача: убрать связь — хранить только
 * `sellerId: string`.
 */

const userTypes = `export interface User {
  id: string
  name: string
}
`

const userIndex = `export type { User } from './model/types'
`

// НАРУШЕНИЕ: сущность product знает про сущность user того же слоя.
const productTypesStart = `import type { User } from '@/entities/user'

export interface Product {
  id: string
  title: string
  seller: User
}
`

const productTypesSolution = `export interface Product {
  id: string
  title: string
  sellerId: string
}
`

const productIndex = `export type { Product } from './model/types'
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/entities/product/index.ts', content: productIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '9.4',
  title: 'Задание 9.4 — Разрыв cross-import (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/product/model/types.ts', content: productTypesStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/product/model/types.ts', content: productTypesSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/product/index.ts', 'Product', './model/types'),
    fileContains(
      'src/entities/product/model/types.ts',
      /sellerId\s*:/,
      'Product хранит только `sellerId`, а не объект User'
    ),
  ],
}
