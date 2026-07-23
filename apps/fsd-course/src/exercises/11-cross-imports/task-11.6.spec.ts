import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 11.6 (сложное) — Распутать узел cross-import'ов, подняв сборку на widget.
 *
 * Сразу два узла связывают `entities/order` и `entities/customer`:
 * 1) в модели — `Customer.lastOrder: Order` и `Order.customer: Customer` (цикл);
 * 2) в ui — `OrderCard` напрямую импортирует `CustomerBadge`.
 * Задача: в модели оставить только идентификаторы (`lastOrderId`, `customerId`), в
 * `OrderCard` — вернуть слот `customerSlot`, а всю сборку (обе сущности вместе)
 * перенести в новый виджет `widgets/order-page/ui/OrderPage.tsx`.
 */

const customerIndex = `export type { Customer } from './model/types'
export { CustomerBadge } from './ui/CustomerBadge'
`
const customerBadge = `import type { Customer } from '../model/types'

export function CustomerBadge({ customer }: { customer: Customer }) {
  return <span className="customer-badge">{customer.email}</span>
}
`

const orderIndex = `export type { Order } from './model/types'
export { OrderCard } from './ui/OrderCard'
`

// НАРУШЕНИЕ: цикл entities/customer -> entities/order -> entities/customer.
const customerTypesStart = `import type { Order } from '@/entities/order'

export interface Customer {
  id: string
  email: string
  lastOrder: Order
}
`
const customerTypesSolution = `export interface Customer {
  id: string
  email: string
  lastOrderId: string
}
`

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

// НАРУШЕНИЕ: ui заказа тянет ui чужой сущности того же слоя.
const orderCardStart = `import type { Order } from '../model/types'
import { CustomerBadge } from '@/entities/customer'

export function OrderCard({ order }: { order: Order }) {
  return (
    <div className="order-card">
      <strong>Order #{order.id}</strong>
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

const orderPageStart = `// TODO: соберите здесь Order и Customer вместе через их публичные API
// ('@/entities/order' и '@/entities/customer'). entities/order и
// entities/customer НЕ должны знать друг о друге напрямую — весь узел
// разматывается здесь, на уровне виджета.

export function OrderPage() {
  return null
}
`
const orderPageSolution = `import { OrderCard, type Order } from '@/entities/order'
import { CustomerBadge, type Customer } from '@/entities/customer'

export function OrderPage({ order, customer }: { order: Order; customer: Customer }) {
  return <OrderCard order={order} customerSlot={<CustomerBadge customer={customer} />} />
}
`

const roFiles = [
  { path: 'src/entities/customer/ui/CustomerBadge.tsx', content: customerBadge, role: 'readonly' as const },
  { path: 'src/entities/customer/index.ts', content: customerIndex, role: 'readonly' as const },
  { path: 'src/entities/order/index.ts', content: orderIndex, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '11.6',
  title: 'Задание 11.6 — Распутать узел cross-import\'ов на уровне widget (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/customer/model/types.ts', content: customerTypesStart, role: 'editable' },
    { path: 'src/entities/order/model/types.ts', content: orderTypesStart, role: 'editable' },
    { path: 'src/entities/order/ui/OrderCard.tsx', content: orderCardStart, role: 'editable' },
    { path: 'src/widgets/order-page/ui/OrderPage.tsx', content: orderPageStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/customer/model/types.ts', content: customerTypesSolution, role: 'editable' },
    { path: 'src/entities/order/model/types.ts', content: orderTypesSolution, role: 'editable' },
    { path: 'src/entities/order/ui/OrderCard.tsx', content: orderCardSolution, role: 'editable' },
    { path: 'src/widgets/order-page/ui/OrderPage.tsx', content: orderPageSolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/customer/index.ts', 'Customer', './model/types'),
    exportsFromPublicApi('src/entities/order/index.ts', 'Order', './model/types'),
    fileContains(
      'src/entities/customer/model/types.ts',
      /lastOrderId\s*:/,
      'Customer ссылается на последний заказ по id, а не объектом Order'
    ),
    fileContains(
      'src/entities/order/model/types.ts',
      /customerId\s*:/,
      'Order ссылается на покупателя по id, а не объектом Customer'
    ),
    fileContains(
      'src/entities/order/ui/OrderCard.tsx',
      /customerSlot/,
      'OrderCard принимает покупателя через слот, а не импортирует CustomerBadge напрямую'
    ),
    fileContains(
      'src/widgets/order-page/ui/OrderPage.tsx',
      /CustomerBadge/,
      'OrderPage собирает OrderCard и CustomerBadge вместе через их публичные API'
    ),
  ],
}
