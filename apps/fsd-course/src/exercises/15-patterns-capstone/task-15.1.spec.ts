import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 15.1 (простое) — Антипаттерн: бизнес-логика в shared.
 *
 * Расчёт суммы заказа — доменная логика сущности `order`, но она случайно оказалась
 * в `shared/lib`, да ещё и тянет тип `Order` глубоким импортом из `entities/order`
 * (импорт вверх по слоям — shared не может зависеть от entities). Задача: перенести
 * функцию в `entities/order`, закрыть слайс public API и переключить потребителя.
 */

const orderTypes = `export interface Order {
  id: string
  items: { price: number; qty: number }[]
}
`

// НАРУШЕНИЕ: доменная логика лежит в shared и глубоко импортирует entities.
const sharedOrderTotalsStart = `import type { Order } from '@/entities/order/model/types'

export function calculateOrderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
}
`

// Эталон: shared больше не знает про домен заказа.
const sharedOrderTotalsSolution = `// Логика расчёта суммы заказа переехала в entities/order — здесь её больше нет.
// shared — для кода без бизнес-смысла (утилиты, конфиг, дизайн-система).
`

const entityOrderTotalsStart = `// TODO: перенесите сюда calculateOrderTotal из shared/lib/orderTotals.ts.
// Импортируйте тип Order из соседнего файла ./types (внутри своего слайса — можно).
`

const entityOrderTotalsSolution = `import type { Order } from './types'

export function calculateOrderTotal(order: Order): number {
  return order.items.reduce((sum, item) => sum + item.price * item.qty, 0)
}
`

const entityIndexStart = `// Public API слайса entities/order.
// TODO: реэкспортируйте наружу тип Order и функцию calculateOrderTotal.
`

const entityIndexSolution = `export type { Order } from './model/types'
export { calculateOrderTotal } from './model/orderTotals'
`

// НАРУШЕНИЕ: виджет тянет расчёт из shared и глубоким импортом — тип из entities.
const cartSummaryStart = `import { calculateOrderTotal } from '@/shared/lib/orderTotals'
import type { Order } from '@/entities/order/model/types'

export function CartSummary({ order }: { order: Order }) {
  return <p>Итого: {calculateOrderTotal(order)} ₽</p>
}
`

const cartSummarySolution = `import { calculateOrderTotal, type Order } from '@/entities/order'

export function CartSummary({ order }: { order: Order }) {
  return <p>Итого: {calculateOrderTotal(order)} ₽</p>
}
`

const roFiles = [
  { path: 'src/entities/order/model/types.ts', content: orderTypes, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '15.1',
  title: 'Задание 15.1 — Бизнес-логика в shared (простое)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    {
      path: 'src/shared/lib/orderTotals.ts',
      content: sharedOrderTotalsStart,
      role: 'editable',
    },
    {
      path: 'src/entities/order/model/orderTotals.ts',
      content: entityOrderTotalsStart,
      role: 'editable',
    },
    { path: 'src/entities/order/index.ts', content: entityIndexStart, role: 'editable' },
    {
      path: 'src/widgets/cart-summary/ui/CartSummary.tsx',
      content: cartSummaryStart,
      role: 'editable',
    },
  ],
  solution: [
    ...roFiles,
    {
      path: 'src/shared/lib/orderTotals.ts',
      content: sharedOrderTotalsSolution,
      role: 'editable',
    },
    {
      path: 'src/entities/order/model/orderTotals.ts',
      content: entityOrderTotalsSolution,
      role: 'editable',
    },
    { path: 'src/entities/order/index.ts', content: entityIndexSolution, role: 'editable' },
    {
      path: 'src/widgets/cart-summary/ui/CartSummary.tsx',
      content: cartSummarySolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/order/index.ts', 'Order', './model/types'),
    exportsFromPublicApi(
      'src/entities/order/index.ts',
      'calculateOrderTotal',
      './model/orderTotals'
    ),
    fileContains(
      'src/widgets/cart-summary/ui/CartSummary.tsx',
      /from\s*'@\/entities\/order'/,
      'Виджет импортирует расчёт суммы через public API `@/entities/order`'
    ),
    fileContains(
      'src/shared/lib/orderTotals.ts',
      /^(?:(?!calculateOrderTotal).)*$/s,
      'shared/lib/orderTotals.ts больше не содержит доменную логику расчёта заказа'
    ),
  ],
}
