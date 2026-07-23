import {
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 11.5 (среднее) — Композиция через слот вместо cross-import в UI.
 *
 * `entities/order/ui/OrderCard` рендерит покупателя, импортируя `CustomerBadge`
 * из соседнего слайса `entities/customer` — cross-import в UI. Задача: убрать
 * импорт, а место под покупателя отдать пропом-слотом `customerSlot`. Кто положит
 * туда `CustomerBadge` — решает виджет `widgets/order-summary` (уже написан
 * правильно, только чтение).
 */

const customerTypes = `export interface Customer {
  id: string
  email: string
}
`
const customerBadge = `import type { Customer } from '../model/types'

export function CustomerBadge({ customer }: { customer: Customer }) {
  return <span className="customer-badge">{customer.email}</span>
}
`
const customerIndex = `export type { Customer } from './model/types'
export { CustomerBadge } from './ui/CustomerBadge'
`

const orderTypes = `export interface Order {
  id: string
  total: number
  customerId: string
}
`
const orderIndex = `export type { Order } from './model/types'
export { OrderCard } from './ui/OrderCard'
`

// НАРУШЕНИЕ: ui заказа тянет ui чужой сущности того же слоя.
const orderCardStart = `import type { Order } from '../model/types'
import { CustomerBadge } from '@/entities/customer'

export function OrderCard({ order, customerEmail }: { order: Order; customerEmail: string }) {
  return (
    <div className="order-card">
      <strong>Order #{order.id}</strong>
      <CustomerBadge customer={{ id: order.customerId, email: customerEmail }} />
    </div>
  )
}
`

const orderCardSolution = `import type { ReactNode } from 'react'
import type { Order } from '../model/types'

export function OrderCard({ order, customerSlot }: { order: Order; customerSlot?: ReactNode }) {
  return (
    <div className="order-card">
      <strong>Order #{order.id}</strong>
      {customerSlot}
    </div>
  )
}
`

// Виджет — правильная композиция: обе сущности встречаются здесь.
const widget = `import { OrderCard, type Order } from '@/entities/order'
import { CustomerBadge, type Customer } from '@/entities/customer'

export function OrderSummary({ order, customer }: { order: Order; customer: Customer }) {
  return <OrderCard order={order} customerSlot={<CustomerBadge customer={customer} />} />
}
`

const roFiles = [
  { path: 'src/entities/customer/model/types.ts', content: customerTypes, role: 'readonly' as const },
  { path: 'src/entities/customer/ui/CustomerBadge.tsx', content: customerBadge, role: 'readonly' as const },
  { path: 'src/entities/customer/index.ts', content: customerIndex, role: 'readonly' as const },
  { path: 'src/entities/order/model/types.ts', content: orderTypes, role: 'readonly' as const },
  { path: 'src/entities/order/index.ts', content: orderIndex, role: 'readonly' as const },
  { path: 'src/widgets/order-summary/ui/OrderSummary.tsx', content: widget, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '11.5',
  title: 'Задание 11.5 — Композиция через слот в виджете (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/order/ui/OrderCard.tsx', content: orderCardStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/order/ui/OrderCard.tsx', content: orderCardSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    fileContains(
      'src/entities/order/ui/OrderCard.tsx',
      /customerSlot/,
      'Покупатель приходит через проп-слот `customerSlot`, а не импортом соседнего слайса'
    ),
  ],
}
