import {
  exportsFromPublicApi,
  fileContains,
  importsRespectLayers,
  noDeepImport,
  type FsdTaskSpec,
} from 'src/engine'

/**
 * Задание 12.3 (сложное) — Несколько нарушений сразу.
 *
 * `features/checkout` одновременно: (1) импортирует константу из вышестоящего слоя
 * `pages/cart` и (2) лезет во внутренний сегмент `entities/order/model` мимо
 * public API, у которого к тому же не заполнен `index.ts`. Задача: завести public
 * API сущности и разорвать обе связи.
 */

const orderTypes = `export interface Order {
  id: string
  total: number
}
`

const orderIndexStart = `// Public API слайса entities/order.
// TODO: реэкспортируйте тип Order из ./model/types.
export {}
`

const orderIndexSolution = `export type { Order } from './model/types'
`

const cartConstants = `export const CART_STORAGE_KEY = 'cart'
`

// НАРУШЕНИЯ: (1) импорт вверх из pages/cart, (2) глубокий импорт entities/order/model.
const checkoutStart = `import type { Order } from '@/entities/order/model/types'
import { CART_STORAGE_KEY } from '@/pages/cart/model/constants'

export function summarize(order: Order): string {
  return \`\${CART_STORAGE_KEY}:\${order.total}\`
}
`

const checkoutSolution = `import type { Order } from '@/entities/order'

const CHECKOUT_STORAGE_KEY = 'cart'

export function summarize(order: Order): string {
  return \`\${CHECKOUT_STORAGE_KEY}:\${order.total}\`
}
`

const roFiles = [
  { path: 'src/entities/order/model/types.ts', content: orderTypes, role: 'readonly' as const },
  { path: 'src/pages/cart/model/constants.ts', content: cartConstants, role: 'readonly' as const },
]

export const spec: FsdTaskSpec = {
  id: '12.3',
  title: 'Задание 12.3 — Несколько нарушений сразу (сложное)',
  aliases: { '@': 'src' },
  files: [
    ...roFiles,
    { path: 'src/entities/order/index.ts', content: orderIndexStart, role: 'editable' },
    { path: 'src/features/checkout/model/checkout.ts', content: checkoutStart, role: 'editable' },
  ],
  solution: [
    ...roFiles,
    { path: 'src/entities/order/index.ts', content: orderIndexSolution, role: 'editable' },
    {
      path: 'src/features/checkout/model/checkout.ts',
      content: checkoutSolution,
      role: 'editable',
    },
  ],
  checks: [
    importsRespectLayers(),
    noDeepImport(),
    exportsFromPublicApi('src/entities/order/index.ts', 'Order', './model/types'),
    fileContains(
      'src/features/checkout/model/checkout.ts',
      /from\s+'@\/entities\/order'/,
      'Order импортируется из public API entities/order, а не из его сегмента'
    ),
    fileContains(
      'src/features/checkout/model/checkout.ts',
      /^(?:(?!pages\/cart)[\s\S])*$/,
      'В checkout.ts не осталось зависимости от pages/cart — константа объявлена локально'
    ),
  ],
}
