import {
  exportsFromPublicApi,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 4.3 (сложное) — Полный public API разросшейся сущности.
 *
 * `entities/order` разрослась: тип, стор, две ui-части (`OrderCard`, `OrderStatus`) и
 * внутренний хелпер форматирования суммы. Виджет `widgets/order-summary` тянет их всех
 * глубокими импортами. Задача: собрать полноценный public API (наружу — `Order`,
 * `orderStore`, `OrderCard`, `OrderStatus`; внутренний `formatOrderTotal` не публикуем)
 * и перевести виджет на него.
 */

const types = `export interface Order {
  id: string
  customerId: string
  total: number
  status: 'new' | 'paid' | 'shipped'
}
`

const store = `import type { Order } from './types'

export const orderStore = {
  current: null as Order | null,
}
`

// Внутренний хелпер слайса — НЕ часть public API.
const formatOrderTotal = `export function formatOrderTotal(total: number) {
  return \`\${total.toFixed(2)} ₽\`
}
`

const orderCard = `import type { Order } from '../model/types'
import { formatOrderTotal } from '../lib/format'

export function OrderCard({ order }: { order: Order }) {
  return (
    <div className="order-card">
      <span>Заказ {order.id}</span>
      <strong>{formatOrderTotal(order.total)}</strong>
    </div>
  )
}
`

const orderStatus = `import type { Order } from '../model/types'

export function OrderStatus({ order }: { order: Order }) {
  return <span className="order-status">{order.status}</span>
}
`

const indexStart = `// Public API слайса entities/order.
// TODO: реэкспортируйте наружу то, что нужно потребителям:
//   тип Order, orderStore, OrderCard, OrderStatus.
// Внутренний formatOrderTotal наружу не выносим.
`

const indexSolution = `export type { Order } from './model/types'
export { orderStore } from './model/store'
export { OrderCard } from './ui/OrderCard'
export { OrderStatus } from './ui/OrderStatus'
`

const summaryStart = `import { OrderCard } from '@/entities/order/ui/OrderCard'
import { OrderStatus } from '@/entities/order/ui/OrderStatus'
import { orderStore } from '@/entities/order/model/store'
import type { Order } from '@/entities/order/model/types'

export function OrderSummary() {
  const order = orderStore.current as Order
  return (
    <section className="order-summary">
      <OrderCard order={order} />
      <OrderStatus order={order} />
    </section>
  )
}
`

const summarySolution = `import { OrderCard, OrderStatus, orderStore, type Order } from '@/entities/order'

export function OrderSummary() {
  const order = orderStore.current as Order
  return (
    <section className="order-summary">
      <OrderCard order={order} />
      <OrderStatus order={order} />
    </section>
  )
}
`

const roFiles = [
  { path: 'src/entities/order/model/types.ts', content: types, role: 'readonly' as const },
  { path: 'src/entities/order/model/store.ts', content: store, role: 'readonly' as const },
  { path: 'src/entities/order/lib/format.ts', content: formatOrderTotal, role: 'hidden' as const },
  { path: 'src/entities/order/ui/OrderCard.tsx', content: orderCard, role: 'readonly' as const },
  { path: 'src/entities/order/ui/OrderStatus.tsx', content: orderStatus, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '4.3',
  title: 'Задание 4.3 — Полный public API сущности (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/order/index.ts', content: indexStart, role: 'editable' },
    { path: 'src/widgets/order-summary/ui/OrderSummary.tsx', content: summaryStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/order/index.ts', content: indexSolution, role: 'editable' },
    {
      path: 'src/widgets/order-summary/ui/OrderSummary.tsx',
      content: summarySolution,
      role: 'editable',
    },
  ],
  checks: [
    exportsFromPublicApi('src/entities/order/index.ts', 'Order', './model/types'),
    exportsFromPublicApi('src/entities/order/index.ts', 'orderStore', './model/store'),
    exportsFromPublicApi('src/entities/order/index.ts', 'OrderCard', './ui/OrderCard'),
    exportsFromPublicApi('src/entities/order/index.ts', 'OrderStatus', './ui/OrderStatus'),
    noDeepImport(),
    importsRespectLayers(),
  ],
}
