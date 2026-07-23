import { fileContains, importsRespectLayers, type FsdTaskSpec } from 'src/engine'

/**
 * Задание 2.2 (среднее) — Два импорта вверх в одном слайсе.
 *
 * Слайс `entities/order` тянет наверх сразу два вышестоящих слоя: `pricing.ts`
 * зовёт `getPromoDiscount` из `features/promo-code`, а `notify.ts` зовёт
 * `showOrderToast` из `widgets/order-toast`. Задача: развернуть обе зависимости —
 * entity должна работать с тем, что ей передали, а не тянуться наверх сама.
 */

const orderTypes = `export interface Order {
  id: string
  total: number
  status: 'new' | 'paid'
}
`

// НАРУШЕНИЕ: entity импортирует функцию из features (выше по стеку).
const pricingStart = `import { getPromoDiscount } from '@/features/promo-code'
import type { Order } from './types'

export function getFinalPrice(order: Order): number {
  const discount = getPromoDiscount(order.id)
  return order.total * (1 - discount)
}
`

const pricingSolution = `import type { Order } from './types'

export function getFinalPrice(order: Order, discount: number): number {
  return order.total * (1 - discount)
}
`

// НАРУШЕНИЕ: entity импортирует функцию из widgets (ещё выше по стеку).
const notifyStart = `import { showOrderToast } from '@/widgets/order-toast'
import type { Order } from './types'

export function markOrderPaid(order: Order): Order {
  showOrderToast(\`Заказ \${order.id} оплачен\`)
  return { ...order, status: 'paid' }
}
`

const notifySolution = `import type { Order } from './types'

export function markOrderPaid(order: Order): Order {
  return { ...order, status: 'paid' }
}
`

const promoCodeIndex = `export function getPromoDiscount(orderId: string): number {
  return orderId.length % 2 === 0 ? 0.1 : 0
}
`

const orderToastIndex = `export function showOrderToast(message: string): void {
  console.log(message)
}
`

const roFiles = [
  { path: 'src/entities/order/model/types.ts', content: orderTypes, role: 'readonly' as const },
  {
    path: 'src/features/promo-code/index.ts',
    content: promoCodeIndex,
    role: 'readonly' as const,
  },
  {
    path: 'src/widgets/order-toast/index.ts',
    content: orderToastIndex,
    role: 'readonly' as const,
  },
]

export const spec: FsdTaskSpec = {
  id: '2.2',
  title: 'Задание 2.2 — Два импорта вверх (среднее)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/order/model/pricing.ts', content: pricingStart, role: 'editable' },
    { path: 'src/entities/order/model/notify.ts', content: notifyStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/order/model/pricing.ts', content: pricingSolution, role: 'editable' },
    { path: 'src/entities/order/model/notify.ts', content: notifySolution, role: 'editable' },
  ],
  checks: [
    importsRespectLayers(),
    fileContains(
      'src/entities/order/model/pricing.ts',
      /getFinalPrice\(order: Order, discount: number\)/,
      'getFinalPrice принимает discount параметром, а не тянет его из features'
    ),
    fileContains(
      'src/entities/order/model/notify.ts',
      /status:\s*'paid'/,
      'markOrderPaid просто возвращает заказ со статусом paid, не дёргая widgets'
    ),
  ],
}
