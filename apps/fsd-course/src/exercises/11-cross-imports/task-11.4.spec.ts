import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 11.4 (простое) — Разрыв cross-import через идентификатор.
 *
 * `entities/order` напрямую импортирует `entities/customer` того же слоя и хранит
 * объект `Customer` целиком. Сущности одного слоя не должны знать друг о друге.
 * Задача: убрать связь — хранить только `customerId: string`.
 */

const customerTypes = `export interface Customer {
  id: string
  email: string
}
`
const customerIndex = `export type { Customer } from './model/types'
`
const orderIndex = `export type { Order } from './model/types'
`

// НАРУШЕНИЕ: сущность order знает про сущность customer того же слоя.
const orderTypesStart = `import type { Customer } from '@/entities/customer'

export interface Order {
  id: string
  total: number
  customer: Customer
}
`
const orderTypesSolution = `export interface Order {
  id: string
  total: number
  customerId: string
}
`

const roFiles = [
  { path: 'src/entities/customer/model/types.ts', content: customerTypes, role: 'readonly' as const },
  { path: 'src/entities/customer/index.ts', content: customerIndex, role: 'readonly' as const },
  { path: 'src/entities/order/index.ts', content: orderIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '11.4',
  title: 'Задание 11.4 — Разрыв cross-import через идентификатор (простое)',
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
    exportsFromPublicApi('src/entities/order/index.ts', 'Order', './model/types'),
    fileContains(
      'src/entities/order/model/types.ts',
      /customerId\s*:/,
      'Order хранит только `customerId`, а не объект Customer'
    ),
  ],
}
