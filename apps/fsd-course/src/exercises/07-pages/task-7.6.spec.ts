import {
  exportsFromPublicApi,
  fileContains,
  fileExists,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 7.6 (сложное) — Разгрузка «толстой» страницы.
 *
 * `pages/order` — типичная «толстая» страница: сама грузит заказ по сети,
 * сама считает итоговую сумму и сама шлёт запрос на подтверждение. Фича
 * `features/submit-order` уже готова и инкапсулирует отправку (readonly).
 * Задача: распределить оставшуюся логику — реализовать `getOrder` и
 * `formatOrderTotal` в `entities/order`, собрать полный public API сущности
 * и public API самой страницы, а `OrderPage` оставить тонкой композицией.
 */

const orderTypes = `export interface Order {
  id: string
  items: { price: number; qty: number }[]
}
`

const getOrderStart = `import type { Order } from '../model/types'

// TODO: реализуйте запрос заказа по id и верните Order.
export const getOrder = async (orderId: string): Promise<Order> => {
  throw new Error('not implemented: ' + orderId)
}
`
const getOrderSolution = `import type { Order } from '../model/types'

export const getOrder = async (orderId: string): Promise<Order> => {
  const res = await fetch(\`/api/orders/\${orderId}\`)
  return res.json()
}
`

const formatOrderTotalStart = `import type { Order } from '../model/types'

// TODO: посчитайте сумму order.items (price * qty) и верните число.
export function formatOrderTotal(order: Order) {
  return 0
}
`
const formatOrderTotalSolution = `import type { Order } from '../model/types'

export function formatOrderTotal(order: Order) {
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
}
`

const orderIndexStart = `// Public API сущности entities/order.
// TODO: реэкспортируйте тип Order, getOrder и formatOrderTotal.
`
const orderIndexSolution = `export type { Order } from './model/types'
export { getOrder } from './api/getOrder'
export { formatOrderTotal } from './lib/formatOrderTotal'
`

const submitOrder = `export const submitOrder = async (orderId: string): Promise<void> => {
  await fetch(\`/api/orders/\${orderId}/submit\`, { method: 'POST' })
}
`
const submitOrderIndex = `export { submitOrder } from './api/submitOrder'
`

// НАРУШЕНИЕ: толстая страница — сама фетчит, сама считает, сама шлёт запрос.
const orderPageStart = `import { useEffect, useState } from 'react'
import type { Order } from '@/entities/order'

export function OrderPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')

  useEffect(() => {
    fetch(\`/api/orders/\${orderId}\`)
      .then(res => res.json())
      .then(setOrder)
  }, [orderId])

  function total(o: Order) {
    return o.items.reduce((sum, item) => sum + item.price * item.qty, 0)
  }

  function handleSubmit() {
    setStatus('submitting')
    fetch(\`/api/orders/\${orderId}/submit\`, { method: 'POST' }).then(() => setStatus('idle'))
  }

  if (!order) return <p>Загрузка...</p>

  return (
    <section>
      <h1>Заказ {order.id}</h1>
      <strong>Итого: {total(order)}</strong>
      <button onClick={handleSubmit} disabled={status === 'submitting'}>
        Оформить
      </button>
    </section>
  )
}
`

const orderPageSolution = `import { useEffect, useState } from 'react'
import { getOrder, formatOrderTotal, type Order } from '@/entities/order'
import { submitOrder } from '@/features/submit-order'

export function OrderPage({ orderId }: { orderId: string }) {
  const [order, setOrder] = useState<Order | null>(null)
  const [status, setStatus] = useState<'idle' | 'submitting'>('idle')

  useEffect(() => {
    getOrder(orderId).then(setOrder)
  }, [orderId])

  function handleSubmit() {
    setStatus('submitting')
    submitOrder(orderId).then(() => setStatus('idle'))
  }

  if (!order) return <p>Загрузка...</p>

  return (
    <section>
      <h1>Заказ {order.id}</h1>
      <strong>Итого: {formatOrderTotal(order)}</strong>
      <button onClick={handleSubmit} disabled={status === 'submitting'}>
        Оформить
      </button>
    </section>
  )
}
`

const pageIndexStart = `// Public API страницы pages/order.
// TODO: реэкспортируйте OrderPage.
`
const pageIndexSolution = `export { OrderPage } from './ui/OrderPage'
`

const roFiles = [
  { path: 'src/entities/order/model/types.ts', content: orderTypes, role: 'readonly' as const },
  {
    path: 'src/features/submit-order/api/submitOrder.ts',
    content: submitOrder,
    role: 'readonly' as const,
  },
  {
    path: 'src/features/submit-order/index.ts',
    content: submitOrderIndex,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '7.6',
  title: 'Задание 7.6 — Разгрузка «толстой» страницы (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/order/api/getOrder.ts', content: getOrderStart, role: 'editable' },
    {
      path: 'src/entities/order/lib/formatOrderTotal.ts',
      content: formatOrderTotalStart,
      role: 'editable',
    },
    { path: 'src/entities/order/index.ts', content: orderIndexStart, role: 'editable' },
    { path: 'src/pages/order/ui/OrderPage.tsx', content: orderPageStart, role: 'editable' },
    { path: 'src/pages/order/index.ts', content: pageIndexStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/order/api/getOrder.ts', content: getOrderSolution, role: 'editable' },
    {
      path: 'src/entities/order/lib/formatOrderTotal.ts',
      content: formatOrderTotalSolution,
      role: 'editable',
    },
    { path: 'src/entities/order/index.ts', content: orderIndexSolution, role: 'editable' },
    { path: 'src/pages/order/ui/OrderPage.tsx', content: orderPageSolution, role: 'editable' },
    { path: 'src/pages/order/index.ts', content: pageIndexSolution, role: 'editable' },
  ],
  checks: [
    fileExists('src/entities/order/api/getOrder.ts'),
    fileExists('src/entities/order/lib/formatOrderTotal.ts'),
    fileContains(
      'src/entities/order/api/getOrder.ts',
      /export const getOrder/,
      '`getOrder` реализована в entities/order/api'
    ),
    fileContains(
      'src/entities/order/lib/formatOrderTotal.ts',
      /export function formatOrderTotal/,
      '`formatOrderTotal` реализована в entities/order/lib'
    ),
    exportsFromPublicApi('src/entities/order/index.ts', 'Order', './model/types'),
    exportsFromPublicApi('src/entities/order/index.ts', 'getOrder', './api/getOrder'),
    exportsFromPublicApi(
      'src/entities/order/index.ts',
      'formatOrderTotal',
      './lib/formatOrderTotal'
    ),
    exportsFromPublicApi('src/pages/order/index.ts', 'OrderPage', './ui/OrderPage'),
    fileContains(
      'src/pages/order/ui/OrderPage.tsx',
      /^(?:(?!fetch\().)*$/s,
      'Страница больше не делает fetch напрямую — запросы ушли в entities/order и features/submit-order'
    ),
    fileContains(
      'src/pages/order/ui/OrderPage.tsx',
      /submitOrder\(/,
      'Отправка заказа идёт через фичу submitOrder'
    ),
    importsRespectLayers(),
    noDeepImport(),
  ],
}
