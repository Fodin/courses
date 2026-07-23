import {
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 4.4 (простое) — Изоляция сущностей: не встраивай объект соседа.
 *
 * `entities/order` напрямую импортирует `entities/user` того же слоя и встраивает
 * объект `User` в `Order` (кто оформил заказ). Задача: убрать связь — хранить только
 * `userId: string`, а сущность заказчика подставит слой выше (widget/feature).
 */

const userTypes = `export interface User {
  id: string
  name: string
}
`

const userIndex = `export type { User } from './model/types'
`

// НАРУШЕНИЕ: сущность order знает про сущность user того же слоя.
const orderTypesStart = `import type { User } from '@/entities/user'

export interface Order {
  id: string
  total: number
  buyer: User
}
`

const orderTypesSolution = `export interface Order {
  id: string
  total: number
  userId: string
}
`

const orderIndex = `export type { Order } from './model/types'
`

const roFiles = [
  { path: 'src/entities/user/model/types.ts', content: userTypes, role: 'readonly' as const },
  { path: 'src/entities/user/index.ts', content: userIndex, role: 'readonly' as const },
  { path: 'src/entities/order/index.ts', content: orderIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '4.4',
  title: 'Задание 4.4 — Изоляция сущностей (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/order/model/types.ts', content: orderTypesStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/order/model/types.ts', content: orderTypesSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/entities/order/model/types.ts',
      /userId\s*:/,
      'Order хранит только `userId`, а не объект User'
    ),
  ],
}
